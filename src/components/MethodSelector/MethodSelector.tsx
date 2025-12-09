import React from 'react';
import { MethodType } from '../../core/types';
import type { MethodType as MethodTypeValue } from '../../core/types';

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
    <div className="method-selector card">
      <div className="card-header spaced">
        <div>
          <h3>Method</h3>
          <p className="muted">Choose the numerical method to solve the system.</p>
        </div>
      </div>
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
