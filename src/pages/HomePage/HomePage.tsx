import React, { useMemo, useState } from 'react';
import MatrixInput from '../../components/MatrixInput/MatrixInput.js';
import VectorInput from '../../components/VectorInput/VectorInput.js';
import MethodSelector from '../../components/MethodSelector/MethodSelector.js';
import SolverOptions from '../../components/SolverOptions/SolverOptions.js';
import FileUploader from '../../components/FileUploader/FileUploader.js';
import SolutionView from '../../components/SolutionView/SolutionView.js';
import IterationTable from '../../components/IterationTable/IterationTable.js';
import Layout from '../../components/Layout/Layout.js';
import { MethodType, solveSlae } from '../../core/index.js';
import type { Matrix, MethodType as MethodTypeValue, SolveOptions, SolveResult, Vector } from '../../core/types.js';

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

  const handleNChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 2) {
      setError('Dimension n must be an integer greater than or equal to 2.');
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
    setN(data.n);
    setA(data.A);
    setB(data.B);
    setResult(null);
    setError(null);
  };

  const isIterativeMethod = useMemo(() => method === MethodType.Jacobi || method === MethodType.Seidel, [method]);

  return (
    <div className="home-page">
      <h1>SLAE Solver</h1>
      <Layout
        left={
          <div className="input-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label className="field">
              <span>Dimension (n)</span>
              <input type="number" min={2} value={n} onChange={(e) => handleNChange(e.target.value)} />
            </label>
            <MethodSelector value={method} onChange={setMethod} />
            <SolverOptions method={method} options={options} onChange={setOptions} />
            <MatrixInput n={n} value={A} onChange={setA} />
            <VectorInput n={n} value={B} onChange={setB} />
            <FileUploader onLoad={handleFileLoad} />
            <button onClick={handleSolve}>Solve</button>
          </div>
        }
        right={
          <div className="results-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <SolutionView result={result} error={error} />
            {isIterativeMethod && <IterationTable iterations={result?.iterations} />}
          </div>
        }
      />
    </div>
  );
};

export default HomePage;
