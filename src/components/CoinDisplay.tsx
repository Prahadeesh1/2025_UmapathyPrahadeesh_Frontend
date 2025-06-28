
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
    if (value >= 100) return 'w-16 h-10';
    if (value >= 50) return 'w-14 h-14';
    if (value >= 10) return 'w-12 h-12';
    if (value >= 1) return 'w-11 h-11';
    if (value >= 0.25) return 'w-10 h-10';
    if (value >= 0.10) return 'w-9 h-9';
    return 'w-8 h-8';
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
        relative flex flex-col items-center gap-2 p-3 rounded-lg transition-all
        ${isSelected 
          ? 'bg-white shadow-lg ring-2 ring-blue-500 transform scale-105' 
          : 'bg-white/70 hover:bg-white hover:shadow-md'
        }
      `}>
        <div className={`
          ${getCoinSize(denomination)} 
          bg-gradient-to-br ${getCoinColor(denomination)} 
          ${isLargeDenomination ? 'rounded-lg' : 'rounded-full'}
          shadow-lg flex items-center justify-center text-white font-bold text-xs
          relative
        `}>
          <span className="text-center leading-tight">
            {getCoinText(denomination)}
          </span>
        </div>
        
        <span className={`
          text-xs font-medium text-center
          ${isSelected ? 'text-blue-700 font-semibold' : 'text-gray-600'}
        `}>
          {formatCurrency(denomination)}
        </span>
        
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
