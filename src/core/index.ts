import { checkSolution } from './checkSolution.js';
import { cramer } from './cramer.js';
import { gauss } from './gauss.js';
import { gaussJordan } from './gaussJordan.js';
import { jacobi } from './jacobi.js';
import { seidel } from './seidel.js';
import { MethodType } from './types.js';
import type { IterativeOptions, Matrix, SolveOptions, SolveResult, Vector } from './types.js';
import { assertDimensions, isSquareMatrix } from './utils.js';

export function solveSlae(method: MethodType, A: Matrix, B: Vector, options: SolveOptions = {}): SolveResult {
  if (!isSquareMatrix(A)) {
    throw new Error('Matrix A must be square.');
  }
  if (A.length === 0) {
    throw new Error('Matrix A must not be empty.');
  }
  assertDimensions(A, B);

  const warnings: string[] = [];
  let solution: Vector = [];
  let iterationsInfo;
  let iterationCount: number | undefined;

  switch (method) {
    case MethodType.Cramer:
      if (A.length > 4) {
        throw new Error('Cramer method supports matrices up to size 4.');
      }
      solution = cramer(A, B);
      break;
    case MethodType.Gauss:
      solution = gauss(A, B);
      break;
    case MethodType.GaussJordan:
      solution = gaussJordan(A, B);
      break;
    case MethodType.Jacobi: {
      const result = jacobi(A, B, options as IterativeOptions);
      solution = result.solution;
      iterationsInfo = result.iterations.map((vector, index) => ({ iteration: index + 1, vector }));
      iterationCount = result.iterationCount;
      break;
    }
    case MethodType.Seidel: {
      const result = seidel(A, B, options as IterativeOptions);
      solution = result.solution;
      iterationsInfo = result.iterations.map((vector, index) => ({ iteration: index + 1, vector }));
      iterationCount = result.iterationCount;
      break;
    }
    default:
      throw new Error('Unsupported method.');
  }

  const isValid = checkSolution(A, B, solution, options.epsilon);
  return { solution, iterations: iterationsInfo, iterationCount, isValid, warnings };
}

export * from './types.js';
export * from './utils.js';
export * from './checkSolution.js';
export * from './cramer.js';
export * from './gauss.js';
export * from './gaussJordan.js';
export * from './jacobi.js';
export * from './seidel.js';
