
import React from 'react';
import { Coins, Trophy } from 'lucide-react';

interface CoinInfo {
  denomination: number;
  count: number;
}

interface CCResponse {
  coins: CoinInfo[];
  totalCoins: number;
}

interface ResultDisplayProps {
  result: CCResponse;
  formatCurrency: (value: number) => string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, formatCurrency }) => {
  const getCoinColor = (value: number) => {
    if (value >= 100) return 'from-green-400 to-green-600';
    if (value >= 50) return 'from-purple-400 to-purple-600';
    if (value >= 10) return 'from-blue-400 to-blue-600';
    if (value >= 5) return 'from-red-400 to-red-600';
    if (value >= 1) return 'from-yellow-400 to-yellow-600';
    if (value >= 0.50) return 'from-gray-300 to-gray-500';
    if (value >= 0.10) return 'from-orange-300 to-orange-500';
    return 'from-amber-300 to-amber-500';
  };

  const getCoinSize = (value: number) => {
    if (value >= 100) return 'w-12 h-8';
    if (value >= 50) return 'w-10 h-10';
    if (value >= 10) return 'w-9 h-9';
    if (value >= 1) return 'w-8 h-8';
    return 'w-7 h-7';
  };

  const getCoinText = (value: number) => {
    if (value >= 100) return `$${value}`;
    if (value >= 1) return `$${value}`;
    return `${Math.round(value * 100)}¢`;
  };

  return (
    <div className="animate-fade-in">
      {/* Bank Vault Result Container */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-gray-700">
        {/* Vault Door Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-800/30 to-transparent"></div>
          <div className="flex items-center justify-center gap-3 relative z-10">
            <Trophy className="w-8 h-8 text-yellow-100" />
            <h3 className="text-2xl font-bold text-white">Exchange Complete</h3>
            <Coins className="w-8 h-8 text-yellow-100" />
          </div>
        </div>

        {/* Vault Interior */}
        <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200">
          {/* Total Coins Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 mb-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Total Coins Required</p>
                <p className="text-4xl font-bold text-green-800">{result.totalCoins}</p>
              </div>
            </div>
          </div>

          {/* Coin Breakdown */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-xl border-2 border-yellow-200">
            <h4 className="text-xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <Coins className="w-6 h-6 text-yellow-600" />
              Your Coin Exchange
            </h4>
            
            <div className="grid gap-4">
              {result.coins.map((coin, index) => {
                const isLargeDenomination = coin.denomination >= 100;
                return (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Single Coin Display */}
                        <div className={`
                          ${getCoinSize(coin.denomination)} 
                          bg-gradient-to-br ${getCoinColor(coin.denomination)} 
                          ${isLargeDenomination ? 'rounded-md' : 'rounded-full'}
                          shadow-lg flex items-center justify-center text-white font-bold text-xs
                          relative overflow-hidden
                        `}>
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                          {!isLargeDenomination && (
                            <div className="absolute inset-0 rounded-full border border-white/30"></div>
                          )}
                          <span className="relative z-10">{getCoinText(coin.denomination)}</span>
                        </div>
                        
                        <div>
                          <p className="font-semibold text-gray-800">
                            {formatCurrency(coin.denomination)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {coin.count} {coin.count === 1 ? 'coin' : 'coins'}
                          </p>
                        </div>
                      </div>

                      {/* Multiple Coins Animation */}
                      <div className="flex items-center gap-1 overflow-hidden">
                        {Array.from({ length: Math.min(coin.count, 5) }, (_, i) => (
                          <div
                            key={i}
                            className={`
                              ${getCoinSize(coin.denomination)} 
                              bg-gradient-to-br ${getCoinColor(coin.denomination)} 
                              ${isLargeDenomination ? 'rounded-md' : 'rounded-full'}
                              shadow-md relative
                              animate-fade-in
                            `}
                            style={{
                              animationDelay: `${i * 100}ms`,
                              transform: `translateX(${i * -8}px) rotate(${i * 10}deg)`,
                              zIndex: 5 - i
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-inherit"></div>
                            {!isLargeDenomination && (
                              <div className="absolute inset-0 rounded-full border border-white/30"></div>
                            )}
                          </div>
                        ))}
                        {coin.count > 5 && (
                          <span className="ml-2 text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            +{coin.count - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
