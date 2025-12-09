import React, { useState } from 'react';
import MatrixInput from '../../components/MatrixInput/MatrixInput';
import VectorInput from '../../components/VectorInput/VectorInput';
import MethodSelector from '../../components/MethodSelector/MethodSelector';
import SolverOptions from '../../components/SolverOptions/SolverOptions';
import FileUploader from '../../components/FileUploader/FileUploader';
import SolutionView from '../../components/SolutionView/SolutionView';
import Layout from '../../components/Layout/Layout';
import { MethodType, solveSlae } from '../../core';
import type { Matrix, MethodType as MethodTypeValue, SolveOptions, SolveResult, Vector } from '../../core/types';

type InputMode = 'manual' | 'file';

const createZeroMatrix = (size: number): Matrix => Array.from({ length: size }, () => Array(size).fill(0));
const createZeroVector = (size: number): Vector => Array(size).fill(0);

const HomePage: React.FC = () => {
  const [n, setN] = useState<number>(3);
  const [method, setMethod] = useState<MethodTypeValue>(MethodType.Gauss);
  const [A, setA] = useState<Matrix>(() => createZeroMatrix(3));
  const [B, setB] = useState<Vector>(() => createZeroVector(3));
  const [options, setOptions] = useState<SolveOptions>({ epsilon: 1e-6, maxIterations: 100 });
  const [result, setResult] = useState<SolveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>('manual');

  const handleNChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 2 || parsed > 10) {
      setError('Dimension n must be an integer between 2 and 10.');
      return;
    }
    setError(null);
    setN(parsed);
    setA(createZeroMatrix(parsed));
    setB(createZeroVector(parsed));
    setResult(null);
  };

  const handleSolve = () => {
    try {
      if (!Number.isInteger(n) || n < 2) {
        setError('Dimension n must be at least 2.');
        setResult(null);
        return;
      }

      if (n > 10) {
        setError('Dimension n must not exceed 10.');
        setResult(null);
        return;
      }

      if (A.length !== n || A.some((row) => row.length !== n)) {
        setError('Matrix A must be an n x n matrix.');
        setResult(null);
        return;
      }

      if (B.length !== n) {
        setError('Vector B must have length n.');
        setResult(null);
        return;
      }

      const solveResult = solveSlae(method, A, B, options);
      setResult(solveResult);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  const handleFileLoad = (data: { n: number; A: Matrix; B: Vector }) => {
    setInputMode('file');
    setN(data.n);
    setA(data.A);
    setB(data.B);
    setResult(null);
    setError(null);
  };

  return (
    <div className="home-page">
      <header className="page-header">
        <div>
          <h1>SLAE Solver</h1>
          <p className="subtitle">Solve systems of linear equations using direct and iterative numerical methods.</p>
        </div>
      </header>
      <Layout
        inputs={
          <div className="input-panel">
            <div className="card">
              <div className="card-header spaced">
                <div>
                  <h3>Method & parameters</h3>
                </div>
              </div>
              <MethodSelector value={method} onChange={setMethod} />
              <SolverOptions method={method} options={options} onChange={setOptions} />
            </div>

            <div className="card">
              <div className="card-header spaced">
                <div>
                  <h3>Input mode</h3>
                  <p className="muted">Switch between manual entry and file upload.</p>
                </div>
              </div>
              <div className="input-mode-toggle">
                <label>
                  <input
                    type="radio"
                    name="input-mode"
                    value="manual"
                    checked={inputMode === 'manual'}
                    onChange={() => setInputMode('manual')}
                  />
                  <span>Manual entry</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="input-mode"
                    value="file"
                    checked={inputMode === 'file'}
                    onChange={() => setInputMode('file')}
                  />
                  <span>Load from file</span>
                </label>
              </div>
            </div>

            {inputMode === 'manual' && (
              <>
                <div className="card">
                  <label className="field">
                    <span className="field-label">Dimension (n)</span>
                    <input type="number" min={2} max={10} value={n} onChange={(e) => handleNChange(e.target.value)} />
                  </label>
                </div>
                <MatrixInput n={n} value={A} onChange={setA} />
                <VectorInput n={n} value={B} onChange={setB} />
              </>
            )}

            {inputMode === 'file' && <FileUploader onLoad={handleFileLoad} />}

            <button className="primary" onClick={handleSolve}>
              Solve
            </button>
          </div>
        }
        results={
          <div className="results-panel">
            <SolutionView result={result} error={error} />
          </div>
        }
      />
    </div>
  );
};

export default HomePage;
