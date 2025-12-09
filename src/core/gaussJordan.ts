import type { Matrix, Vector } from './types.js';
import { assertDimensions, createAugmentedMatrix, swapRows } from './utils.js';

export function gaussJordan(A: Matrix, B: Vector): Vector {
  assertDimensions(A, B);
  const n = A.length;
  const augmented = createAugmentedMatrix(A, B);

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

    const pivot = augmented[i][i];
    for (let c = 0; c <= n; c++) {
      augmented[i][c] /= pivot;
    }

    for (let r = 0; r < n; r++) {
      if (r === i) continue;
      const factor = augmented[r][i];
      for (let c = 0; c <= n; c++) {
        augmented[r][c] -= factor * augmented[i][c];
      }
    }
  }

  return augmented.map((row) => row[n]);
}
