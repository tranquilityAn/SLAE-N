import React from 'react';
import type { Vector } from '../../core/types';

interface VectorInputProps {
  n: number;
  value: Vector;
  onChange: (next: Vector) => void;
}

const VectorInput: React.FC<VectorInputProps> = ({ n, value, onChange }) => {
  const handleChange = (index: number, raw: string) => {
    const numericValue = raw === '' ? 0 : Number(raw);
    const nextVector = value.map((item, i) => (i === index ? numericValue : item));
    onChange(nextVector);
  };

  return (
    <div className="vector-input card">
      <div className="card-header">
        <h3>Vector B</h3>
        <p className="muted">Enter constant terms for each equation.</p>
      </div>
      <div className="vector-grid">
        {Array.from({ length: n }).map((_, index) => (
          <input
            key={index}
            type="number"
            value={value[index] ?? 0}
            onChange={(e) => handleChange(index, e.target.value)}
            className="vector-cell no-spinner"
          />
        ))}
      </div>
    </div>
  );
};

export default VectorInput;
