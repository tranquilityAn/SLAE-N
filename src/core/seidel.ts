import type { IterativeOptions, Matrix, Vector } from './types.js';
import { assertDimensions, multiplyMatrixVector, norm, subtractVectors } from './utils.js';

const DEFAULT_EPSILON = 1e-6;
const DEFAULT_MAX_ITER = 1000;

export function seidel(A: Matrix, B: Vector, options: IterativeOptions = {}): { solution: Vector; iterations: Vector[]; iterationCount: number } {
  assertDimensions(A, B);
  const n = A.length;
  const epsilon = options.epsilon ?? DEFAULT_EPSILON;
  const maxIter = options.maxIterations ?? DEFAULT_MAX_ITER;
  const x: Vector = options.initialGuess ? [...options.initialGuess] : Array(n).fill(0);
  const iterations: Vector[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    const xOld = [...x];
    for (let i = 0; i < n; i++) {
      if (Math.abs(A[i][i]) < Number.EPSILON) {
        throw new Error('Zero diagonal element encountered in Seidel method.');
      }
      let sum = B[i];
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum -= A[i][j] * x[j];
        }
      }
      x[i] = sum / A[i][i];
    }

    iterations.push([...x]);
    const diff = norm(subtractVectors(x, xOld));
    if (diff < epsilon) {
      return { solution: [...x], iterations, iterationCount: iter };
    }
  }

  throw new Error('Seidel method did not converge within the maximum number of iterations.');
}

export function seidelCheckResidual(A: Matrix, B: Vector, x: Vector): number {
  const Ax = multiplyMatrixVector(A, x);
  return norm(subtractVectors(Ax, B));
}
