import assert from 'node:assert/strict';
import { checkSolution, cramer, gauss, gaussJordan, jacobi, seidel, solveSlae, MethodType } from '../src/core/index.js';
import type { Matrix, Vector } from '../src/core/index.js';

const EPS = 1e-6;

type TestCase = {
  name: string;
  fn: () => void;
};

function assertVectorClose(actual: Vector, expected: Vector, epsilon = EPS): void {
  assert.equal(actual.length, expected.length, 'Vector lengths differ');
  actual.forEach((value, idx) => {
    assert.ok(Math.abs(value - expected[idx]) < epsilon, `Index ${idx} differs: ${value} vs ${expected[idx]}`);
  });
}

const tests: TestCase[] = [
  {
    name: 'Cramer solves a 2x2 system correctly',
    fn: () => {
      const A: Matrix = [
        [1, 2],
        [3, 4],
      ];
      const B: Vector = [5, 11];
      const solution = cramer(A, B);
      assertVectorClose(solution, [1, 2]);
    },
  },
  {
    name: 'Cramer rejects matrices larger than 4x4',
    fn: () => {
      const A: Matrix = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => (r === c ? 1 : 0)));
      const B: Vector = Array(5).fill(1);
      assert.throws(() => cramer(A, B), /up to size 4/);
    },
  },
  {
    name: 'Gauss solves a 3x3 system',
    fn: () => {
      const A: Matrix = [
        [2, 1, -1],
        [-3, -1, 2],
        [-2, 1, 2],
      ];
      const B: Vector = [8, -11, -3];
      const solution = gauss(A, B);
      assertVectorClose(solution, [2, 3, -1]);
    },
  },
  {
    name: 'Gauss-Jordan solves the same 3x3 system',
    fn: () => {
      const A: Matrix = [
        [2, 1, -1],
        [-3, -1, 2],
        [-2, 1, 2],
      ];
      const B: Vector = [8, -11, -3];
      const solution = gaussJordan(A, B);
      assertVectorClose(solution, [2, 3, -1]);
    },
  },
  {
    name: 'Jacobi converges for a diagonally dominant system',
    fn: () => {
      const A: Matrix = [
        [10, 1],
        [2, 8],
      ];
      const B: Vector = [11, 10];
      const { solution, iterationCount } = jacobi(A, B, { epsilon: 1e-8, maxIterations: 200 });
      assert.ok(iterationCount && iterationCount > 0);
      assertVectorClose(solution, [1, 1], 1e-5);
      assert.ok(checkSolution(A, B, solution, 1e-4));
    },
  },
  {
    name: 'Seidel converges for the same system',
    fn: () => {
      const A: Matrix = [
        [10, 1],
        [2, 8],
      ];
      const B: Vector = [11, 10];
      const { solution, iterationCount } = seidel(A, B, { epsilon: 1e-8, maxIterations: 200 });
      assert.ok(iterationCount && iterationCount > 0);
      assertVectorClose(solution, [1, 1], 1e-6);
      assert.ok(checkSolution(A, B, solution, 1e-5));
    },
  },
  {
    name: 'solveSlae wraps Jacobi and provides iteration metadata',
    fn: () => {
      const A: Matrix = [
        [5, 1],
        [2, 6],
      ];
      const B: Vector = [6, 8];
      const result = solveSlae(MethodType.Jacobi, A, B, { epsilon: 1e-8, maxIterations: 200 });
      assert.ok(result.iterations && result.iterations.length > 0);
      assert.ok(result.iterationCount && result.iterationCount > 0);
      assert.ok(result.isValid, 'Solution should pass validation');
      assertVectorClose(result.solution, [1, 1], 1e-5);
    },
  },
  {
    name: 'checkSolution detects incorrect solution',
    fn: () => {
      const A: Matrix = [
        [2, 0],
        [0, 2],
      ];
      const B: Vector = [2, 2];
      assert.equal(checkSolution(A, B, [1, 1]), true);
      assert.equal(checkSolution(A, B, [2, 2]), false);
    },
  },
];

let failures = 0;
for (const test of tests) {
  try {
    test.fn();
    console.log(`✓ ${test.name}`);
  } catch (error) {
    failures += 1;
    console.error(`✗ ${test.name}`);
    console.error(error instanceof Error ? error.message : error);
  }
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exitCode = 1;
} else {
  console.log(`\nAll ${tests.length} tests passed.`);
}
