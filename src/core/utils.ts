import type { Matrix, Vector } from './types.js';

export function cloneMatrix(matrix: Matrix): Matrix {
  return matrix.map((row) => [...row]);
}

export function isSquareMatrix(matrix: Matrix): boolean {
  return matrix.length > 0 && matrix.every((row) => row.length === matrix.length);
}

export function assertDimensions(A: Matrix, B: Vector): void {
  if (!isSquareMatrix(A)) {
    throw new Error('Coefficient matrix must be square.');
  }
  if (A.length !== B.length) {
    throw new Error('Vector length must match matrix dimension.');
  }
}

export function swapRows(matrix: Matrix, i: number, j: number): void {
  const temp = matrix[i];
  matrix[i] = matrix[j];
  matrix[j] = temp;
}

export function determinant(matrix: Matrix): number {
  if (!isSquareMatrix(matrix)) {
    throw new Error('Determinant is defined only for square matrices.');
  }
  const n = matrix.length;
  const m = cloneMatrix(matrix);
  let det = 1;
  for (let i = 0; i < n; i++) {
    let pivotRow = i;
    for (let r = i + 1; r < n; r++) {
      if (Math.abs(m[r][i]) > Math.abs(m[pivotRow][i])) {
        pivotRow = r;
      }
    }
    if (Math.abs(m[pivotRow][i]) < Number.EPSILON) {
      return 0;
    }
    if (pivotRow !== i) {
      swapRows(m, pivotRow, i);
      det *= -1;
    }
    det *= m[i][i];
    const pivot = m[i][i];
    for (let r = i + 1; r < n; r++) {
      const factor = m[r][i] / pivot;
      for (let c = i; c < n; c++) {
        m[r][c] -= factor * m[i][c];
      }
    }
  }
  return det;
}

export function norm(vector: Vector): number {
  return Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
}

export function subtractVectors(a: Vector, b: Vector): Vector {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length.');
  }
  return a.map((value, index) => value - b[index]);
}

export function multiplyMatrixVector(A: Matrix, x: Vector): Vector {
  if (A[0]?.length !== x.length) {
    throw new Error('Matrix columns must match vector length.');
  }
  return A.map((row) => row.reduce((sum, value, i) => sum + value * x[i], 0));
}

export function replaceColumn(matrix: Matrix, column: number, vector: Vector): Matrix {
  if (matrix.length !== vector.length) {
    throw new Error('Replacement vector length must match matrix dimension.');
  }
  return matrix.map((row, rIndex) => row.map((value, cIndex) => (cIndex === column ? vector[rIndex] : value)));
}

export function createAugmentedMatrix(A: Matrix, B: Vector): Matrix {
  return A.map((row, i) => [...row, B[i]]);
}

export function backSubstitution(U: Matrix, y: Vector): Vector {
  const n = U.length;
  const x: Vector = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = y[i];
    for (let j = i + 1; j < n; j++) {
      sum -= U[i][j] * x[j];
    }
    if (Math.abs(U[i][i]) < Number.EPSILON) {
      throw new Error('Matrix is singular during back substitution.');
    }
    x[i] = sum / U[i][i];
  }
  return x;
}
