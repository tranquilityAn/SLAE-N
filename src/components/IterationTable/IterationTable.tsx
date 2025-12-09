import React from 'react';
import type { IterationInfo } from '../../core/types.js';

interface IterationTableProps {
  iterations?: IterationInfo[];
}

const formatVector = (vector: number[]): string => vector.map((value) => value.toFixed(6)).join(', ');

const IterationTable: React.FC<IterationTableProps> = ({ iterations }) => {
  if (!iterations || iterations.length === 0) {
    return null;
  }

  const computeDiff = (current: number[], previous?: number[]): number | undefined => {
    if (!previous || current.length !== previous.length) return undefined;
    const diff = Math.sqrt(current.reduce((sum, value, index) => sum + Math.pow(value - previous[index], 2), 0));
    return diff;
  };

  return (
    <div className="iteration-table">
      <h3>Iterations</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Vector</th>
            <th>Diff Norm</th>
          </tr>
        </thead>
        <tbody>
          {iterations.map((item, index) => {
            const previous = index > 0 ? iterations[index - 1].vector : undefined;
            const diff = item.diff ?? computeDiff(item.vector, previous);
            return (
              <tr key={item.iteration}>
                <td>{item.iteration}</td>
                <td>{formatVector(item.vector)}</td>
                <td>{diff !== undefined ? diff.toExponential(3) : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IterationTable;
