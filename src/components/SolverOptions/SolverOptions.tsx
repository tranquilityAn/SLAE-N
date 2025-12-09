import React from 'react';
import { MethodType } from '../../core/types';
import type { MethodType as MethodTypeValue, SolveOptions } from '../../core/types';

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
    <div className="solver-options card">
      <div className="card-header">
        <h3>Iterative options</h3>
        <p className="muted">Applies to Jacobi and Seidel methods.</p>
      </div>
      <div className="options-grid">
        <label className="option-field">
          <span className="field-label">Epsilon</span>
          <input
            type="number"
            step="0.000001"
            value={options.epsilon ?? ''}
            onChange={(e) => handleNumberChange('epsilon', e.target.value)}
          />
        </label>
        <label className="option-field">
          <span className="field-label">Max iterations</span>
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
