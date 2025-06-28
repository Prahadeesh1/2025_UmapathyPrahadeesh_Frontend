import React, { useState, useEffect } from 'react';
import { Coins, Banknote, Building2, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="w-12 h-12 text-blue-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Coin Exchange Bank
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted partner for efficient coin change calculations
          </p>
        </div>

        {/* Bank Building Container */}
        <div className="relative mb-8 animate-scale-in">
          {/* Bank Building */}
          <div className="relative bg-gradient-to-b from-stone-200 to-stone-300 rounded-t-2xl shadow-2xl overflow-hidden">
            
            {/* Bank Roof with Triangle */}
            <div className="relative h-16 bg-gradient-to-b from-slate-600 to-slate-700 clip-path-triangle">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-800/20 to-transparent"></div>
              {/* Roof ornament */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-8 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full"></div>
            </div>
            
            {/* Bank Sign */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white text-center py-4 relative border-t-4 border-yellow-400">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent"></div>
              <h2 className="text-2xl font-bold relative z-10 flex items-center justify-center gap-2">
                <Coins className="w-6 h-6" />
                FIRST NATIONAL COIN BANK
                <Banknote className="w-6 h-6" />
              </h2>
            </div>

            {/* Bank Facade with Columns */}
            <div className="relative bg-gradient-to-b from-stone-100 to-stone-200">
              {/* Classical Columns */}
              <div className="absolute inset-0 flex justify-between px-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 bg-gradient-to-b from-stone-300 to-stone-400 shadow-lg">
                    {/* Column capital */}
                    <div className="h-4 bg-gradient-to-b from-stone-200 to-stone-300 -mx-1 rounded-t-sm"></div>
                    {/* Column shaft */}
                    <div className="flex-1 bg-gradient-to-r from-stone-300 via-stone-200 to-stone-300"></div>
                    {/* Column base */}
                    <div className="h-3 bg-gradient-to-b from-stone-300 to-stone-400 -mx-1"></div>
                  </div>
                ))}
              </div>

              {/* Bank Windows */}
              <div className="relative z-10 pt-8 pb-4">
                <div className="flex justify-center gap-8 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-12 bg-gradient-to-b from-blue-900 to-blue-950 rounded-lg border-4 border-yellow-600 shadow-inner">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400/20 to-transparent rounded-sm"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bank Entrance/Interior */}
            <div className="p-8 bg-gradient-to-b from-amber-50 to-yellow-50 relative min-h-[600px]">
              {/* Marble floor pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(0,0,0,0.1) 20px, rgba(0,0,0,0.1) 22px)`
                }}></div>
              </div>
              
              {/* Connection Status & API URL */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bank API Connection
                  </label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-white/90"
                    placeholder="http://localhost:8080"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg border-2 border-gray-200 flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2">
                      {getConnectionIcon()}
                      <span className="font-medium text-sm">{getConnectionStatusText()}</span>
                    </div>
                    <button
                      onClick={checkApiHealth}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-8 relative z-10">
                <label className="block text-lg font-semibold text-gray-700 mb-3">
                  Amount to Exchange ($)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-xl">$</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    max="10000"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-4 text-xl border-3 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-white/90 shadow-inner backdrop-blur-sm"
                    placeholder="Enter amount (e.g., 0.41)"
                  />
                </div>
              </div>

              {/* Coin Selection */}
              <div className="relative z-10">
                <CoinSelector
                  validDenominations={validDenominations}
                  selectedDenominations={selectedDenominations}
                  onDenominationChange={handleDenominationChange}
                  onSelectAll={selectAllDenominations}
                  onClearAll={clearAllDenominations}
                  formatCurrency={formatCurrency}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mb-8 relative z-10">
                <button
                  onClick={calculateCoins}
                  disabled={loading || connectionStatus === 'disconnected'}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3 ${
                    loading || connectionStatus === 'disconnected'
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105'
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Coins className="w-5 h-5" />
                      Calculate Exchange
                    </>
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Bank Foundation/Steps */}
          <div className="relative">
            <div className="h-6 bg-gradient-to-b from-stone-400 to-stone-500 rounded-b-lg shadow-lg"></div>
            <div className="h-4 bg-gradient-to-b from-stone-500 to-stone-600 rounded-b-md shadow-lg mx-4"></div>
            <div className="h-3 bg-gradient-to-b from-stone-600 to-stone-700 rounded-b-sm shadow-lg mx-8"></div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-1">Connection Error</h4>
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
        <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Bank API Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-mono">
            <div className="p-3 bg-white rounded-lg border">
              <strong>Health Check:</strong>
              <br />GET {apiUrl}/api/v1/coin-change/health
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <strong>Calculate:</strong>
              <br />POST {apiUrl}/api/v1/coin-change/calculate
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <strong>Denominations:</strong>
              <br />GET {apiUrl}/api/v1/coin-change/valid-denominations
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-500 italic">
            💡 Tip: Set VITE_API_URL environment variable to change the default API URL
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoinChangeCalculator;
