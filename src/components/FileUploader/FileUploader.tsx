import React, { useState } from 'react';
import type { Matrix, Vector } from '../../core/types.js';

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

    const n = Number(lines[0]);
    if (!Number.isInteger(n) || n < 2) {
      throw new Error('Invalid dimension in file.');
    }

    const matrixLines = lines.slice(1, n + 1);
    const vectorLines = lines.slice(n + 1, n * 2 + 1);

    if (matrixLines.length !== n || vectorLines.length !== n) {
      throw new Error('File does not contain expected number of lines.');
    }

    const A: Matrix = matrixLines.map((line) => {
      const row = line.split(/\s+/).map(Number);
      if (row.length !== n || row.some((value) => Number.isNaN(value))) {
        throw new Error('Invalid matrix data in file.');
      }
      return row;
    });

    const B: Vector = vectorLines.map((line) => {
      const value = Number(line);
      if (Number.isNaN(value)) {
        throw new Error('Invalid vector data in file.');
      }
      return value;
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
    <div className="file-uploader">
      <label htmlFor="file">Load from file (.txt)</label>
      <input id="file" type="file" accept=".txt" onChange={handleFileChange} />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FileUploader;
