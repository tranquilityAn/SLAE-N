import type { Matrix, Vector } from './types.js';
import { multiplyMatrixVector, norm, subtractVectors } from './utils.js';

export function checkSolution(A: Matrix, B: Vector, X: Vector, epsilon = 1e-6): boolean {
  const AX = multiplyMatrixVector(A, X);
  const residual = subtractVectors(AX, B);
  return norm(residual) < epsilon;
}
