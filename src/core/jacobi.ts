import type { IterativeOptions, Matrix, Vector } from './types.js';
import { assertDimensions, multiplyMatrixVector, norm, subtractVectors } from './utils.js';

const DEFAULT_EPSILON = 1e-6;
const DEFAULT_MAX_ITER = 1000;

export function jacobi(A: Matrix, B: Vector, options: IterativeOptions = {}): { solution: Vector; iterations: Vector[]; iterationCount: number } {
  assertDimensions(A, B);
  const n = A.length;
  const epsilon = options.epsilon ?? DEFAULT_EPSILON;
  const maxIter = options.maxIterations ?? DEFAULT_MAX_ITER;
  let xOld: Vector = options.initialGuess ?? Array(n).fill(0);
  const iterations: Vector[] = [];

  for (let iter = 1; iter <= maxIter; iter++) {
    const xNew: Vector = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
      if (Math.abs(A[i][i]) < Number.EPSILON) {
        throw new Error('Zero diagonal element encountered in Jacobi method.');
      }
      let sum = B[i];
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          sum -= A[i][j] * xOld[j];
        }
      }
      xNew[i] = sum / A[i][i];
    }

    iterations.push([...xNew]);
    const diff = norm(subtractVectors(xNew, xOld));
    if (diff < epsilon) {
      return { solution: xNew, iterations, iterationCount: iter };
    }
    xOld = xNew;
  }

  throw new Error('Jacobi method did not converge within the maximum number of iterations.');
}

export function jacobiCheckResidual(A: Matrix, B: Vector, x: Vector): number {
  const Ax = multiplyMatrixVector(A, x);
  return norm(subtractVectors(Ax, B));
}
