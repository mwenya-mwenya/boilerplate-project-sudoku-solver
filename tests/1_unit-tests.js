const chai = require('chai');
const assert = chai.assert;
const sudokuSolver = require('../controllers/sudoku-solver.js');


// test variables 
const validStringLength = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const validStringSolution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';

const invalidStringLessThan81 = '*.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
const validCoodinate = 'A9';
const invalidCoodinate = 'J10';

// test arrays


suite('Unit Tests', function () {
    test('Logic handles a valid puzzle string of 81 characters', function () {
        assert.isTrue(sudokuSolver.validateStringLength(validStringLength));
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        assert.isTrue(sudokuSolver.validString(validStringLength));
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        assert.isFalse(sudokuSolver.validateStringLength(invalidStringLessThan81));
    });

    test('Logic handles a valid row placement', function () {
        assert.isTrue(sudokuSolver.coordinateCheck(validCoodinate));
        assert.strictEqual(sudokuSolver.getCoodinates(validCoodinate).rolNum, 0);
    });

    test('Logic handles an invalid row placement', function () {
        assert.isFalse(sudokuSolver.coordinateCheck(invalidCoodinate));
    });

    test('Logic handles a valid col placement', function () {
        assert.isTrue(sudokuSolver.coordinateCheck(validCoodinate));
        assert.strictEqual(sudokuSolver.getCoodinates(validCoodinate).colNum, 8);
    });

    test('Logic handles an invalid column placement', function () {
        assert.isFalse(sudokuSolver.coordinateCheck(invalidCoodinate));
    });

    test('Logic handles a valid region (3x3 grid) placement', function () {
        assert.isTrue(sudokuSolver.coordinateCheck(validCoodinate));
        assert.strictEqual(sudokuSolver.getCoodinates(validCoodinate).regNum, 2);
    });

    test('Logic handles an invalid region (3x3 grid) placement', function () {
        assert.isFalse(sudokuSolver.coordinateCheck(invalidCoodinate));
    });

    test('Valid puzzle strings pass the solver', function () {
        assert.isTrue(sudokuSolver.validString(validStringLength));
        assert.isTrue(sudokuSolver.validateStringLength(validStringLength));
    });

    test('Invalid puzzle strings fail the solver', function () {
        assert.isFalse(sudokuSolver.validString(invalidStringLessThan81));
        assert.isFalse(sudokuSolver.validateStringLength(invalidStringLessThan81));
    });

    test('Solver returns the expected solution for an incomplete puzzle', function () {
        assert.strictEqual(sudokuSolver.solve(validStringLength), validStringSolution);

    });

});
