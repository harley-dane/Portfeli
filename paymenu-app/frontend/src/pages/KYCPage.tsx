import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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

const KYCPage: React.FC = () => {
  const { user, token, refreshUserContext } = useAuth();
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
    address: '',
  });
  const [kycStatus, setKycStatus] = useState<string | null>(user?.kycStatus || null);
  const [kycDetails, setKycDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStatus, setIsFetchingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchKycStatus = async () => {
      if (token) {
        setIsFetchingStatus(true);
        setError(null); // Clear previous errors
        try {
          const response = await api.get('/kyc/status');
          setKycStatus(response.data.kycStatus);
          setKycDetails(response.data.kycData);
          if (refreshUserContext && user?.kycStatus !== response.data.kycStatus) { // Refresh only if status changed
             await refreshUserContext();
          }
        } catch (err) {
          console.error("Failed to fetch KYC status", err);
          // @ts-ignore
          setError(err.response?.data?.message || "Failed to fetch current KYC status.");
        } finally {
          setIsFetchingStatus(false);
        }
      } else {
        setIsFetchingStatus(false);
      }
    };
    fetchKycStatus();
  }, [token, refreshUserContext]); // Removed user dependency to avoid potential loops

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    if (!formData.documentType || !formData.documentNumber.trim() || !formData.address.trim()) {
      setError("All fields are required for KYC submission.");
      return false;
    }
    if (formData.documentNumber.trim().length < 5) { // Example simple validation
        setError("Document number seems too short.");
        return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/kyc/submit', formData);
      setKycStatus(response.data.kycStatus);
      setKycDetails(response.data.kycData);
      setSuccessMessage(response.data.message || 'KYC data submitted successfully!');
      if (refreshUserContext) await refreshUserContext();
    } catch (err) {
      console.error("KYC Submission failed", err);
      // @ts-ignore
      setError(err.response?.data?.message || "KYC submission failed. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingStatus) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-700"></div>
        <p className="ml-3 text-gray-700">Loading KYC information...</p>
      </div>
    );
  }

  if (kycStatus === 'verified') {
    return (
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10">
        <div className="text-center">
          <span className="text-6xl">🎉</span>
          <h1 className="text-2xl font-bold text-green-600 my-4">KYC Verified!</h1>
          <p className="mb-3 text-gray-700">Your identity has been successfully verified.</p>
        </div>
        {kycDetails && (
          <div className="bg-green-50 p-4 rounded-md border border-green-200 text-sm text-green-700 space-y-1">
            <p><strong>Document Type:</strong> {kycDetails.documentType}</p>
            <p><strong>Document Number:</strong> ********{kycDetails.documentNumber?.slice(-4)}</p>
            <p><strong>Address:</strong> {kycDetails.address}</p>
            <p><strong>Submitted At:</strong> {new Date(kycDetails.submittedAt).toLocaleString()}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-lg mx-auto bg-white rounded-xl shadow-xl mt-10">
      <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Submit KYC Information</h1>
      {kycStatus && kycStatus !== 'none' && (
         <p className="mb-6 text-center font-semibold">Current Status: <span className={`capitalize font-bold ${kycStatus === 'pending' ? 'text-yellow-600' : kycStatus === 'rejected' ? 'text-red-600' : 'text-gray-700'}`}>{kycStatus}</span></p>
      )}
      <ErrorDisplay message={error} />
      <SuccessDisplay message={successMessage} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
          <select
            name="documentType" id="documentType" value={formData.documentType} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          >
            <option value="passport">Passport</option>
            <option value="drivers_license">Driver's License</option>
            <option value="national_id">National ID</option>
          </select>
        </div>

        <div>
          <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1">Document Number</label>
          <input
            type="text" name="documentNumber" id="documentNumber" value={formData.documentNumber} onChange={handleChange}
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
          <textarea
            name="address" id="address" value={formData.address} onChange={handleChange} rows={3}
            className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
          />
        </div>

        <button
          type="submit" disabled={isLoading}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
};

export default KYCPage;
