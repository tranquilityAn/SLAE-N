import React from 'react';
import { MethodType } from '../../core/types.js';
import type { MethodType as MethodTypeValue, SolveOptions } from '../../core/types.js';

interface SolverOptionsProps {
  method: MethodTypeValue;
  options: SolveOptions;
  onChange: (options: SolveOptions) => void;
}

const SolverOptions: React.FC<SolverOptionsProps> = ({ method, options, onChange }) => {
  const isIterative = method === MethodType.Jacobi || method === MethodType.Seidel;

  const handleNumberChange = (key: keyof SolveOptions, raw: string) => {
    const value = raw === '' ? undefined : Number(raw);
    onChange({ ...options, [key]: value });
  };

  if (!isIterative) {
    return null;
  }

  return (
    <div className="solver-options">
      <h4>Iterative Options</h4>
      <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
        <label className="option-field">
          <span>Epsilon</span>
          <input
            type="number"
            step="0.0001"
            value={options.epsilon ?? ''}
            onChange={(e) => handleNumberChange('epsilon', e.target.value)}
          />
        </label>
        <label className="option-field">
          <span>Max Iterations</span>
          <input
            type="number"
            min={1}
            value={options.maxIterations ?? ''}
            onChange={(e) => handleNumberChange('maxIterations', e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default SolverOptions;
