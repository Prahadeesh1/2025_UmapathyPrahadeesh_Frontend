
import React from 'react';

interface CoinDisplayProps {
  denomination: number;
  isSelected: boolean;
  onChange: (checked: boolean) => void;
  formatCurrency: (value: number) => string;
}

const CoinDisplay: React.FC<CoinDisplayProps> = ({
  denomination,
  isSelected,
  onChange,
  formatCurrency,
}) => {
  const getCoinColor = (value: number) => {
    if (value >= 100) return 'from-green-400 to-green-600'; // Bills
    if (value >= 50) return 'from-purple-400 to-purple-600'; // $50
    if (value >= 10) return 'from-blue-400 to-blue-600'; // $10+
    if (value >= 5) return 'from-red-400 to-red-600'; // $5
    if (value >= 1) return 'from-yellow-400 to-yellow-600'; // $1+
    if (value >= 0.50) return 'from-gray-300 to-gray-500'; // 50¢+
    if (value >= 0.10) return 'from-orange-300 to-orange-500'; // 10¢+
    return 'from-amber-300 to-amber-500'; // Pennies and nickels
  };

  const getCoinSize = (value: number) => {
    if (value >= 100) return 'w-16 h-10'; // Bills (rectangular)
    if (value >= 50) return 'w-14 h-14'; // Large denominations
    if (value >= 10) return 'w-12 h-12';
    if (value >= 1) return 'w-11 h-11';
    if (value >= 0.25) return 'w-10 h-10';
    if (value >= 0.10) return 'w-9 h-9';
    return 'w-8 h-8'; // Smallest coins
  };

  const getCoinText = (value: number) => {
    if (value >= 100) return `$${value}`;
    if (value >= 1) return `$${value}`;
    return `${Math.round(value * 100)}¢`;
  };

  const isLargeDenomination = denomination >= 100;

  return (
    <label className="cursor-pointer group">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <div className={`
        relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all duration-300
        ${isSelected 
          ? 'bg-white shadow-lg ring-2 ring-blue-500 transform scale-105' 
          : 'bg-white/70 hover:bg-white hover:shadow-md group-hover:transform group-hover:scale-105'
        }
      `}>
        {/* Coin/Bill Display */}
        <div className={`
          ${getCoinSize(denomination)} 
          bg-gradient-to-br ${getCoinColor(denomination)} 
          ${isLargeDenomination ? 'rounded-lg' : 'rounded-full'}
          shadow-lg flex items-center justify-center text-white font-bold text-xs
          ${isSelected ? 'animate-pulse' : ''}
          relative overflow-hidden
        `}>
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
          
          {/* Bill pattern for large denominations */}
          {isLargeDenomination && (
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1 left-1 w-2 h-2 border border-white rounded-full"></div>
              <div className="absolute bottom-1 right-1 w-2 h-2 border border-white rounded-full"></div>
            </div>
          )}
          
          {/* Coin ridges for circular coins */}
          {!isLargeDenomination && (
            <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
          )}
          
          <span className="text-center leading-tight relative z-10">
            {getCoinText(denomination)}
          </span>
        </div>
        
        {/* Value Label */}
        <span className={`
          text-xs font-medium text-center
          ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-600'}
        `}>
          {formatCurrency(denomination)}
        </span>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
    </label>
  );
};

export default CoinDisplay;
