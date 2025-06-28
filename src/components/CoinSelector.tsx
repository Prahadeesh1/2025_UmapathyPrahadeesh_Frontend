
import React from 'react';
import CoinDisplay from './CoinDisplay';

interface CoinSelectorProps {
  validDenominations: number[];
  selectedDenominations: number[];
  onDenominationChange: (denomination: number, checked: boolean) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  formatCurrency: (value: number) => string;
}

const CoinSelector: React.FC<CoinSelectorProps> = ({
  validDenominations,
  selectedDenominations,
  onDenominationChange,
  onSelectAll,
  onClearAll,
  formatCurrency,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <label className="text-lg font-semibold text-gray-700">
          Available Denominations
        </label>
        <div className="flex gap-3">
          <button
            onClick={onSelectAll}
            className="px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 rounded-lg transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 rounded-lg transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6 bg-gray-50 rounded-xl border">
        {validDenominations.map((denomination) => (
          <CoinDisplay
            key={denomination}
            denomination={denomination}
            isSelected={selectedDenominations.includes(denomination)}
            onChange={(checked) => onDenominationChange(denomination, checked)}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </div>
  );
};

export default CoinSelector;
