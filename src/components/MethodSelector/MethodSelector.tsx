import React from 'react';
import { MethodType } from '../../core/types.js';
import type { MethodType as MethodTypeValue } from '../../core/types.js';

interface MethodSelectorProps {
  value: MethodTypeValue;
  onChange: (method: MethodTypeValue) => void;
}

const METHOD_OPTIONS = [
  { label: 'Cramer', value: MethodType.Cramer },
  { label: 'Gauss', value: MethodType.Gauss },
  { label: 'Gauss-Jordan', value: MethodType.GaussJordan },
  { label: 'Jacobi', value: MethodType.Jacobi },
  { label: 'Seidel', value: MethodType.Seidel },
];

const MethodSelector: React.FC<MethodSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="method-selector">
      <label htmlFor="method">Method</label>
      <select
        id="method"
        value={value}
        onChange={(e) => onChange(e.target.value as MethodTypeValue)}
        className="method-select"
      >
        {METHOD_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MethodSelector;
