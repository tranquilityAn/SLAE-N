import React, { useState } from 'react';
import type { Matrix, Vector } from '../../core/types';

interface LoadedData {
  n: number;
  A: Matrix;
  B: Vector;
}

interface FileUploaderProps {
  onLoad: (data: LoadedData) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onLoad }) => {
  const [error, setError] = useState<string | null>(null);

  const parseFileContent = (content: string): LoadedData => {
    const lines = content
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error('File does not contain enough data.');
    }

    const n = Number(lines[0]);
    if (!Number.isInteger(n) || n < 2 || n > 10) {
      throw new Error('Invalid dimension in file. Use an integer between 2 and 10.');
    }

    const rows = lines.slice(1);
    if (rows.length < n) {
      throw new Error('File does not contain expected number of rows.');
    }

    const A: Matrix = [];
    const B: Vector = [];

    rows.slice(0, n).forEach((line, rowIndex) => {
      const numbers = line.split(/\s+/).map(Number);
      if (numbers.length !== n + 1 || numbers.some((value) => Number.isNaN(value))) {
        throw new Error(`Invalid data on row ${rowIndex + 1}.`);
      }

      A.push(numbers.slice(0, n));
      B.push(numbers[n]);
    });

    return { n, A, B };
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = typeof reader.result === 'string' ? reader.result : '';
        const data = parseFileContent(content);
        setError(null);
        onLoad(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid file format.');
      }
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsText(file);
  };

  return (
    <div className="file-uploader card">
      <div className="card-header spaced">
        <div>
          <h3>Load from file</h3>
          <p className="muted">Format: n, then n lines with coefficients A followed by B in the same line.</p>
        </div>
      </div>
      <label className="upload-field" htmlFor="file">
        <span>Choose a .txt file</span>
        <input id="file" type="file" accept=".txt" onChange={handleFileChange} />
      </label>
      <p className="muted small">Example: 4 on the first line, then rows like "10 2 0 1 9" (last number is B).</p>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FileUploader;
