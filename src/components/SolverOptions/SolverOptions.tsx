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

  const currentExponent =
    options.epsilon && options.epsilon > 0 ? Math.log10(options.epsilon) : Math.log10(1e-6);

  const handleExponentChange = (raw: string) => {
    if (raw === '') {
      onChange({ ...options, epsilon: undefined });
      return;
    }

    const exponent = Number(raw);
    onChange({ ...options, epsilon: 10 ** exponent });
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
          <span className="field-label">Epsilon (10^k)</span>
          <input
            type="number"
            step={1}
            value={Number.isFinite(currentExponent) ? currentExponent : ''}
            onChange={(e) => handleExponentChange(e.target.value)}
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
