import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// In-memory stores
const users = [];
const transactions = [];
const cardRequests = []; // For mocked card issuance

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined. Check .env file.");
  process.exit(1);
}

app.use(express.json());

// --- Helper Functions ---
const generateToken = (user) => {
  return jwt.sign({ userId: user.id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const generateMockCardDetails = (cardType) => {
  const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
  const expiryMonth = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
  const expiryYear = (new Date().getFullYear() + 3 + Math.floor(Math.random() * 3)).toString().slice(-2); // Expires in 3-5 years
  return {
    cardNumberLastFour: lastFour,
    expiryDate: `${expiryMonth}/${expiryYear}`,
    cvv: Math.floor(100 + Math.random() * 900).toString(), // Mock CVV
    cardHolderName: "Valued Customer", // Generic name
    cardNetwork: cardType.toUpperCase(),
  };
};

// --- Auth Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1];
  if (token == null) return res.status(401).json({ message: 'No token provided, authorization denied.' });

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) return res.status(403).json({ message: 'Token is not valid.' });
    const userExists = users.find(u => u.id === decodedUser.userId);
    if (!userExists) return res.status(403).json({ message: 'User associated with token no longer exists.' });
    req.user = userExists;
    next();
  });
};

// --- Public Endpoints ---
app.get('/api', (req, res) => res.json({ message: 'PayMenu Backend API is running!' }));
app.get('/api/health', (req, res) => res.json({ status: 'UP', timestamp: new Date().toISOString() }));

// --- Auth Endpoints ---
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username || password.length < 6) {
    return res.status(400).json({ message: 'Valid email, password (min 6 chars), and username are required.' });
  }
  if (users.find(user => user.email === email)) return res.status(409).json({ message: 'Email already exists.' });
  if (users.find(user => user.username === username)) return res.status(409).json({ message: 'Username taken.' });

  try {
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const newUser = {
      id: uuidv4(), username, email, passwordHash,
      kycStatus: 'none', kycData: null,
      balance: 1000, // Mock starting balance
      cards: [], // Array to store issued card info for the user
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    const token = generateToken(newUser);
    const { passwordHash: _, ...userResponse } = newUser;
    res.status(201).json({
      message: 'User registered. Please complete KYC.', token, user: userResponse
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

  const user = users.find(user => user.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = generateToken(user);
  const { passwordHash: _, ...userResponse } = user;
  res.status(200).json({
    message: 'Login successful.', token, user: userResponse
  });
});

// --- KYC Endpoints ---
app.post('/api/kyc/submit', authenticateToken, (req, res) => {
  const { documentType, documentNumber, address } = req.body;
  if (!documentType || !documentNumber || !address) {
    return res.status(400).json({ message: 'Document type, number, and address are required.' });
  }
  req.user.kycData = { documentType, documentNumber, address, submittedAt: new Date().toISOString() };
  req.user.kycStatus = 'verified';

  console.log(`KYC data submitted for user ${req.user.username}`);
  res.status(200).json({
    message: 'KYC information submitted and auto-verified.',
    kycStatus: req.user.kycStatus,
    kycData: req.user.kycData
  });
});

app.get('/api/kyc/status', authenticateToken, (req, res) => {
  res.status(200).json({
    kycStatus: req.user.kycStatus,
    kycData: req.user.kycData,
    userId: req.user.id
  });
});

// --- User Profile Endpoint ---
app.get('/api/user/profile', authenticateToken, (req, res) => {
  const { passwordHash: _, ...profileData } = req.user;
  res.status(200).json({ message: 'User profile fetched successfully.', data: profileData });
});

// --- Remittance Endpoints ---
app.post('/api/transfers/send', authenticateToken, (req, res) => {
  const sender = req.user;
  if (sender.kycStatus !== 'verified') {
    return res.status(403).json({ message: 'KYC verification required to make transfers.' });
  }
  const { recipientIdentifier, amount, currency } = req.body;
  if (!recipientIdentifier || !amount || !currency || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Recipient, valid amount, and currency are required.' });
  }
  const recipient = users.find(u => u.email === recipientIdentifier || u.username === recipientIdentifier);
  if (!recipient) return res.status(404).json({ message: 'Recipient not found.' });
  if (recipient.id === sender.id) return res.status(400).json({ message: 'Cannot send money to yourself.' });
  if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance.' });

  sender.balance -= amount;
  recipient.balance += amount;
  const newTransaction = {
    id: uuidv4(), senderId: sender.id, senderUsername: sender.username,
    recipientId: recipient.id, recipientUsername: recipient.username,
    amount, currency, status: 'completed', timestamp: new Date().toISOString()
  };
  transactions.push(newTransaction);
  console.log(`Transfer: ${amount} ${currency} from ${sender.username} to ${recipient.username}`);
  res.status(200).json({ message: 'Transfer successful.', transaction: newTransaction });
});

app.get('/api/user/transactions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const userTransactions = transactions.filter(
    tx => tx.senderId === userId || tx.recipientId === userId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.status(200).json({ transactions: userTransactions });
});

// --- Card Issuance Endpoints ---
app.post('/api/cards/issue', authenticateToken, (req, res) => {
  const user = req.user;
  if (user.kycStatus !== 'verified') {
    return res.status(403).json({ message: 'KYC verification required to issue cards.' });
  }
  const { cardType } = req.body; // e.g., "VISA", "MASTERCARD"
  if (!cardType || !['VISA', 'MASTERCARD'].includes(cardType.toUpperCase())) {
    return res.status(400).json({ message: 'Valid card type (VISA or MASTERCARD) is required.' });
  }

  // Check if user already has a card of this type (optional rule: one card per type)
  // For simplicity, allow multiple cards.

  const mockDetails = generateMockCardDetails(cardType);
  const newCardRequest = {
    id: uuidv4(),
    userId: user.id,
    cardType: cardType.toUpperCase(),
    status: 'issued', // Auto-issue for mock
    ...mockDetails,
    requestedAt: new Date().toISOString()
  };
  cardRequests.push(newCardRequest);

  // Also add a reference or basic info to the user object's card array
  if (!user.cards) user.cards = [];
  user.cards.push({
    id: newCardRequest.id,
    cardType: newCardRequest.cardType,
    cardNumberLastFour: newCardRequest.cardNumberLastFour,
    expiryDate: newCardRequest.expiryDate
  });

  console.log(`Card issued for user ${user.username}: ${cardType}`);
  res.status(201).json({ message: `${cardType} card issued successfully.`, card: newCardRequest });
});

app.get('/api/user/cards', authenticateToken, (req, res) => {
  const user = req.user;
  // Fetch from the global cardRequests list or from user.cards array
  const userCards = cardRequests.filter(cr => cr.userId === user.id);
  // Or, more simply if storing on user:
  // const userCards = user.cards || [];
  res.status(200).json({ cards: userCards });
});


app.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});

// Debug endpoints
app.get('/api/debug/users', (req, res) => {
    res.json(users.map(u => ({...u, passwordHash: undefined })));
});
app.get('/api/debug/transactions', (req, res) => res.json(transactions));
app.get('/api/debug/cardrequests', (req, res) => res.json(cardRequests));
