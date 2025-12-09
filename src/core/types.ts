export type Matrix = number[][];
export type Vector = number[];

export const MethodType = {
  Cramer: 'cramer',
  Gauss: 'gauss',
  GaussJordan: 'gaussJordan',
  Jacobi: 'jacobi',
  Seidel: 'seidel',
} as const;

export type MethodType = (typeof MethodType)[keyof typeof MethodType];

export interface IterativeOptions {
  epsilon?: number;
  maxIterations?: number;
  initialGuess?: Vector;
}

export interface SolveOptions extends IterativeOptions {}

export interface IterationInfo {
  iteration: number;
  vector: Vector;
  diff?: number;
}

export interface SolveResult {
  solution: Vector;
  iterations?: IterationInfo[];
  iterationCount?: number;
  isValid?: boolean;
  warnings?: string[];
}
