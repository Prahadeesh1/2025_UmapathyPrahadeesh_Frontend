
import React from 'react';
import { Coins } from 'lucide-react';

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
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 p-4">
        <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Coins className="w-6 h-6" />
          Exchange Complete
        </h3>
      </div>

      <div className="p-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6 text-center">
          <p className="text-sm font-medium text-green-700 mb-1">Total Coins Required</p>
          <p className="text-3xl font-bold text-green-800">{result.totalCoins}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Coin Breakdown
          </h4>
          
          <div className="space-y-3">
            {result.coins.map((coin, index) => {
              const isLargeDenomination = coin.denomination >= 100;
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      ${getCoinSize(coin.denomination)} 
                      bg-gradient-to-br ${getCoinColor(coin.denomination)} 
                      ${isLargeDenomination ? 'rounded-md' : 'rounded-full'}
                      shadow flex items-center justify-center text-white font-bold text-xs
                    `}>
                      <span>{getCoinText(coin.denomination)}</span>
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

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(coin.count, 3) }, (_, i) => (
                      <div
                        key={i}
                        className={`
                          w-6 h-6 
                          bg-gradient-to-br ${getCoinColor(coin.denomination)} 
                          ${isLargeDenomination ? 'rounded-sm' : 'rounded-full'}
                          shadow-sm
                        `}
                        style={{ transform: `translateX(${i * -4}px)`, zIndex: 3 - i }}
                      />
                    ))}
                    {coin.count > 3 && (
                      <span className="ml-1 text-sm font-medium text-gray-600">
                        +{coin.count - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
