import React from 'react';
import type { Vector } from '../../core/types.js';

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
    <div className="vector-input">
      <h3>Vector B</h3>
      <div className="vector-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
        {Array.from({ length: n }).map((_, index) => (
          <input
            key={index}
            type="number"
            value={value[index] ?? 0}
            onChange={(e) => handleChange(index, e.target.value)}
            className="vector-cell"
          />
        ))}
      </div>
    </div>
  );
};

export default VectorInput;
