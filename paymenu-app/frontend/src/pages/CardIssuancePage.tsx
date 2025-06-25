import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';

interface Card {
  id: string;
  cardType: string;
  cardNumberLastFour: string;
  expiryDate: string;
  cardHolderName?: string;
  status?: string;
  requestedAt?: string;
}

const ErrorDisplay: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

const SuccessDisplay: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md my-4" role="alert">
      <p className="font-bold">Success</p>
      <p>{message}</p>
    </div>
  );
};

const CardDisplay: React.FC<Card> = ({ cardType, cardNumberLastFour, expiryDate, cardHolderName }) => {
  const isVisa = cardType.toUpperCase() === 'VISA';
  const bgColor = isVisa ? 'bg-gradient-to-br from-blue-600 to-blue-400' : 'bg-gradient-to-br from-gray-800 to-gray-600';
  const textColor = 'text-white';

  return (
    <div className={`p-5 rounded-xl shadow-lg ${bgColor} ${textColor} w-full max-w-xs mx-auto transform hover:scale-105 transition-transform duration-300 ease-out`}>
      <div className="flex justify-between items-center mb-4">
        {/* Placeholder for logos; actual SVGs/PNGs would need to be in public/ and linked */}
        <span className="font-bold text-xl italic">{isVisa ? 'VISA' : 'Mastercard'}</span>
         <svg className="w-10 h-10 opacity-80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            {isVisa ? (
                <path d="M14.4 11.52L10.56 26.88H7.2L11.04 11.52H14.4ZM24.96 11.52L21.12 26.88H17.28L21.12 11.52H24.96ZM30.24 12.24C30.96 12.24 31.44 12.72 31.44 13.44V25.44C31.44 26.16 30.96 26.64 30.24 26.64H27.36C26.64 26.64 26.16 26.16 26.16 25.44V13.44C26.16 12.72 26.64 12.24 27.36 12.24H30.24ZM40.8 11.52L34.56 20.16L40.8 26.88H36.96L33.12 21.6L29.28 26.88H25.44L31.68 18.24L29.28 11.52H33.12L35.52 16.8L37.92 11.52H40.8Z" fill="white"/>
            ) : ( // Mastercard-like circles
                <>
                <circle cx="16" cy="20" r="8" fill="#EA001B"/>
                <circle cx="32" cy="20" r="8" fill="#F79E1B" fillOpacity="0.8"/>
                </>
            )}
        </svg>
      </div>
      <div className="mb-5 text-center">
        <p className="text-xl sm:text-2xl tracking-widest font-mono">···· ···· ···· {cardNumberLastFour}</p>
      </div>
      <div className="flex justify-between text-xs items-end">
        <div>
          <p className="opacity-70 uppercase text-xxs">Card Holder</p>
          <p className="font-medium text-sm">{cardHolderName || "Valued Customer"}</p>
        </div>
        <div>
          <p className="opacity-70 uppercase text-xxs text-right">Expires</p>
          <p className="font-medium text-sm text-right">{expiryDate}</p>
        </div>
      </div>
    </div>
  );
};


const CardIssuancePage: React.FC = () => {
  const { user, refreshUserContext } = useAuth();
  const [cardType, setCardType] = useState<'VISA' | 'MASTERCARD'>('VISA');
  const [issuedCards, setIssuedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCards, setIsFetchingCards] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserCards = async () => {
      if (!user) return;
      setIsFetchingCards(true);
      setError(null); // Clear previous errors
      try {
        const response = await api.get<{ cards: Card[] }>('/user/cards');
        setIssuedCards(response.data.cards || []);
      } catch (err) {
        console.error("Failed to fetch user cards", err);
        // @ts-ignore
        setError(err.response?.data?.message || "Could not load your cards at this time.");
      } finally {
        setIsFetchingCards(false);
      }
    };
    if (user?.kycStatus === 'verified') {
        fetchUserCards();
    } else {
        setIsFetchingCards(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Basic client-side validation (though backend handles it too)
    if (!cardType) {
        setError("Please select a card type.");
        return;
    }

    setIsLoading(true);
    try {
      const response = await api.post<{ message: string; card: Card }>('/cards/issue', { cardType });
      setSuccessMessage(response.data.message || \`Successfully requested \${cardType} card!\`);
      setIssuedCards(prevCards => [...prevCards, response.data.card]);
      if (refreshUserContext) await refreshUserContext();
    } catch (err) {
      console.error("Card issuance failed", err);
      // @ts-ignore
      setError(err.response?.data?.message || "Card issuance failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (user && user.kycStatus !== 'verified') {
    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10 text-center">
            <h1 className="text-xl font-bold text-red-600 mb-3">KYC Verification Required</h1>
            <p className="text-gray-700 mb-4">Please complete KYC verification to access card features.</p>
            <Link to="/kyc" className="inline-block px-6 py-2.5 bg-indigo-600 text-white font-medium text-xs leading-tight uppercase rounded-md shadow-md hover:bg-indigo-700 hover:shadow-lg focus:bg-indigo-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-indigo-800 active:shadow-lg transition duration-150 ease-in-out">
                Go to KYC Page
            </Link>
        </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto mt-10 space-y-10">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">Request New Virtual Card</h1>
        <ErrorDisplay message={error} />
        <SuccessDisplay message={successMessage} />

        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <div>
            <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-1">Select Card Type</label>
            <select
              name="cardType" id="cardType" value={cardType}
              onChange={(e) => setCardType(e.target.value as 'VISA' | 'MASTERCARD')}
              className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            >
              <option value="VISA">VISA</option>
              <option value="MASTERCARD">Mastercard</option>
            </select>
          </div>

          <button
            type="submit" disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
          >
            {isLoading ? 'Processing Request...' : 'Request Card'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-gray-800">Your Issued Cards</h2>
        {isFetchingCards && (
            <div className="flex justify-center items-center min-h-[100px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-700"></div>
                <p className="ml-3 text-gray-600">Loading your cards...</p>
            </div>
        )}
        {!isFetchingCards && !error && issuedCards.length === 0 && (
          <p className="text-center text-gray-500 py-6">You have no cards issued yet. Request one above!</p>
        )}
        {/* Display error for fetching cards if it occurred and no cards are shown */}
        {!isFetchingCards && error && issuedCards.length === 0 && (
             <ErrorDisplay message={error} />
        )}
        {!isFetchingCards && issuedCards.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {issuedCards.map(card => (
              <CardDisplay key={card.id} {...card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CardIssuancePage;
