import type { Matrix, Vector } from './types.js';
import { determinant, replaceColumn } from './utils.js';

export function cramer(A: Matrix, B: Vector): Vector {
  const n = A.length;
  if (n === 0) {
    throw new Error('Matrix must not be empty.');
  }
  if (n > 4) {
    throw new Error('Cramer method supports matrices up to size 4.');
  }
  const detA = determinant(A);
  if (Math.abs(detA) < Number.EPSILON) {
    throw new Error('Determinant is zero, system has no unique solution.');
  }

  const solution: Vector = Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    const Ai = replaceColumn(A, i, B);
    const detAi = determinant(Ai);
    solution[i] = detAi / detA;
  }
  return solution;
}
