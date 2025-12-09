import type { Matrix, Vector } from './types.js';
import { assertDimensions, backSubstitution, cloneMatrix, swapRows } from './utils.js';

export function gauss(A: Matrix, B: Vector): Vector {
  assertDimensions(A, B);
  const n = A.length;
  const augmented = cloneMatrix(A).map((row, i) => [...row, B[i]]);

  for (let i = 0; i < n; i++) {
    let pivotRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(augmented[r][i]) > Math.abs(augmented[pivotRow][i])) {
        pivotRow = r;
      }
    }
    if (Math.abs(augmented[pivotRow][i]) < Number.EPSILON) {
      throw new Error('Matrix is singular or nearly singular.');
    }
    if (pivotRow !== i) {
      swapRows(augmented, pivotRow, i);
    }

    for (let r = i + 1; r < n; r++) {
      const factor = augmented[r][i] / augmented[i][i];
      for (let c = i; c <= n; c++) {
        augmented[r][c] -= factor * augmented[i][c];
      }
    }
  }

  const upper = augmented.map((row) => row.slice(0, n));
  const y = augmented.map((row) => row[n]);
  return backSubstitution(upper, y);
}
