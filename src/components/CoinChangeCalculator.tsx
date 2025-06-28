
import React, { useState, useEffect } from 'react';
import { Coins, Banknote, Wifi, WifiOff, Loader2 } from 'lucide-react';
import CoinSelector from './CoinSelector';
import ResultDisplay from './ResultDisplay';

// TypeScript interfaces matching your API DTOs
interface CoinInfo {
  denomination: number;
  count: number;
}

interface CCResponse {
  coins: CoinInfo[];
  totalCoins: number;
}

interface ErrorResponse {
  error: string;
  message: string;
}

interface CCRequest {
  amount: number;
  denominations: number[];
}

const CoinChangeCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [selectedDenominations, setSelectedDenominations] = useState<number[]>([]);
  const [validDenominations] = useState<number[]>([0.01, 0.05, 0.10, 0.20, 0.50, 1.00, 2.00, 5.00, 10.00, 50.00, 100.00, 1000.00]);
  const [result, setResult] = useState<CCResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiUrl, setApiUrl] = useState<string>(import.meta.env.VITE_API_URL || 'http://localhost:8080');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Health check on component mount and when API URL changes
  useEffect(() => {
    checkApiHealth();
  }, [apiUrl]);

  const checkApiHealth = async () => {
    setConnectionStatus('checking');
    try {
      const response = await fetch(`${apiUrl}/api/v1/coin-change/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });
      if (!response.ok) {
        setError('API is not responding. Please check if the server is running on the correct port.');
        setConnectionStatus('disconnected');
      } else {
        setError('');
        setConnectionStatus('connected');
        console.log('API Health Check: OK');
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('CORS Error: Unable to connect to API. Please ensure CORS is configured on your server and it\'s running on the correct port.');
      } else {
        setError('Unable to connect to API. Please check if the server is running.');
      }
      setConnectionStatus('disconnected');
      console.error('Health Check Error:', err);
    }
  };

  const handleDenominationChange = (denomination: number, checked: boolean) => {
    if (checked) {
      setSelectedDenominations(prev => [...prev, denomination].sort((a, b) => a - b));
    } else {
      setSelectedDenominations(prev => prev.filter(d => d !== denomination));
    }
  };

  const calculateCoins = async () => {
    if (!amount || selectedDenominations.length === 0) {
      setError('Please enter an amount and select at least one denomination.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0 || amountNum > 10000) {
      setError('Please enter a valid amount between 0 and 10000.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const request: CCRequest = {
        amount: amountNum,
        denominations: selectedDenominations
      };

      const response = await fetch(`${apiUrl}/api/v1/coin-change/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify(request)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as ErrorResponse;
        setError(errorData.message || 'An error occurred while calculating.');
      } else {
        const resultData = data as CCResponse;
        setResult(resultData);
      }
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        setError('CORS Error: Unable to connect to API. Please ensure CORS is configured on your server.');
      } else {
        setError('Failed to connect to the API. Please check if the server is running.');
      }
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  const clearForm = () => {
    setAmount('');
    setSelectedDenominations([]);
    setResult(null);
    setError('');
  };

  const selectAllDenominations = () => {
    setSelectedDenominations([...validDenominations]);
  };

  const clearAllDenominations = () => {
    setSelectedDenominations([]);
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-4 h-4 text-green-500" />;
      case 'disconnected': return <WifiOff className="w-4 h-4 text-red-500" />;
      case 'checking': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return <WifiOff className="w-4 h-4 text-gray-500" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connected';
      case 'disconnected': return 'Disconnected';
      case 'checking': return 'Checking...';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Coins className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-600">
              Coin Exchange Calculator
            </h1>
            <Banknote className="w-10 h-10 text-blue-600" />
          </div>
          <p className="text-lg text-gray-600">
            Calculate the minimum coins needed for change
          </p>
        </div>

        {/* Main Container */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          
          {/* Connection Status & API URL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Connection
              </label>
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="http://localhost:8080"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="bg-gray-50 p-3 rounded-md border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getConnectionIcon()}
                  <span className="font-medium text-sm">{getConnectionStatusText()}</span>
                </div>
                <button
                  onClick={checkApiHealth}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-2">
              Amount to Exchange ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max="10000"
                step="0.01"
                className="w-full pl-8 pr-3 py-3 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount (e.g., 0.41)"
              />
            </div>
          </div>

          {/* Coin Selection */}
          <CoinSelector
            validDenominations={validDenominations}
            selectedDenominations={selectedDenominations}
            onDenominationChange={handleDenominationChange}
            onSelectAll={selectAllDenominations}
            onClearAll={clearAllDenominations}
            formatCurrency={formatCurrency}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center mb-6">
            <button
              onClick={calculateCoins}
              disabled={loading || connectionStatus === 'disconnected'}
              className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 ${
                loading || connectionStatus === 'disconnected'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Coins className="w-4 h-4" />
                  Calculate Exchange
                </>
              )}
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div>
                <h4 className="font-medium text-red-800">Connection Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Display */}
        {result && (
          <ResultDisplay result={result} formatCurrency={formatCurrency} />
        )}

        {/* API Information */}
        <div className="mt-8 p-4 bg-gray-50 rounded-md border">
          <h4 className="font-medium text-gray-700 mb-3">API Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="p-2 bg-white rounded border text-xs font-mono">
              <strong>Health Check:</strong><br />GET {apiUrl}/api/v1/coin-change/health
            </div>
            <div className="p-2 bg-white rounded border text-xs font-mono">
              <strong>Calculate:</strong><br />POST {apiUrl}/api/v1/coin-change/calculate
            </div>
            <div className="p-2 bg-white rounded border text-xs font-mono">
              <strong>Denominations:</strong><br />GET {apiUrl}/api/v1/coin-change/valid-denominations
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500 italic">
            💡 Tip: Set VITE_API_URL environment variable to change the default API URL
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoinChangeCalculator;
