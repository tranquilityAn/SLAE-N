import React from 'react';
import type { Matrix } from '../../core/types.js';

interface MatrixInputProps {
  n: number;
  value: Matrix;
  onChange: (next: Matrix) => void;
}

const MatrixInput: React.FC<MatrixInputProps> = ({ n, value, onChange }) => {
  const handleCellChange = (row: number, col: number, raw: string) => {
    const numericValue = raw === '' ? 0 : Number(raw);
    const nextMatrix = value.map((currentRow, rIndex) =>
      currentRow.map((cell, cIndex) => (rIndex === row && cIndex === col ? numericValue : cell))
    );
    onChange(nextMatrix);
  };

  return (
    <div className="matrix-input">
      <h3>Matrix A</h3>
      <div className="matrix-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${n}, 1fr)`, gap: '0.5rem' }}>
        {Array.from({ length: n }).map((_, row) =>
          Array.from({ length: n }).map((__, col) => (
            <input
              key={`${row}-${col}`}
              type="number"
              value={value[row]?.[col] ?? 0}
              onChange={(e) => handleCellChange(row, col, e.target.value)}
              className="matrix-cell"
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MatrixInput;
