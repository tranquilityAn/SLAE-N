import React from 'react';
import type { SolveResult } from '../../core/types';

interface SolutionViewProps {
  result: SolveResult | null;
  error: string | null;
}

const SolutionView: React.FC<SolutionViewProps> = ({ result, error }) => {
  if (error) {
    return (
      <div className="solution-view card">
        <div className="card-header">
          <h3>Result</h3>
        </div>
        <p className="error-text">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="solution-view card">
        <div className="card-header">
          <h3>Result</h3>
        </div>
        <p className="muted">No computation yet.</p>
      </div>
    );
  }

  return (
    <div className="solution-view card">
      <div className="card-header">
        <h3>Result</h3>
      </div>
      <div className="solution-list">
        <strong>Solution X</strong>
        <ul>
          {result.solution.map((value, index) => (
            <li key={index}>
              x{index + 1} = {value}
            </li>
          ))}
        </ul>
      </div>
      <p className="validation">
        {result.isValid ? 'Solution is valid: AX ≈ B' : 'Solution failed verification'}
      </p>
      {result.warnings && result.warnings.length > 0 && (
        <div className="warnings">
          <strong>Warnings</strong>
          <ul>
            {result.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SolutionView;
