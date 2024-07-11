const arrayCreator = require('../arrayCreators');
const solver = require('../solverLogic.js');

/**
 * Class representing a Sudoku solver with methods to validate and solve puzzles.
 */
class SudokuSolver {

  /**
   * Validates if the puzzle string has the correct length.
   * @param {string} puzzleString - The puzzle string to validate.
   * @returns {boolean} True if valid, false otherwise.
   */
  validateStringLength(puzzleString) {
    return puzzleString.length === 81;
  }

  coordinateCheck(cood) {
    let strCood = cood.toUpperCase();
    return /^[A-I][1-9]$/g.test(strCood)
  }

  validString(string) {
    return /^[0-9.]+$/g.test(string);
  }

  getCoodinates(cood) {
    // Convert column letter to number (0-indexed)
    let colNum = parseInt(cood[1], 10) - 1; 
    // Convert row number to 0-indexed integer
    let rolNum = cood[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);

    const findBoxIndex = (row, col) => {
      let boxRow = Math.floor(row / 3);
      let boxCol = Math.floor(col / 3);
      return boxRow * 3 + boxCol;
    };

    return {
      colNum: colNum,
      rolNum: rolNum,
      strIndex: (rolNum * 9) + colNum,
      regNum: findBoxIndex(rolNum,colNum)
    }
  }
  /**
   * Checks if the row placement is valid.
   * @param {string} puzzleString - The puzzle string.
   * @returns {boolean} True if the row placement is valid, false otherwise.
   */
  checkRowPlacement(puzzleString) {
    let rowArr = arrayCreator.createRowArray(puzzleString);
    return arrayCreator.check(rowArr);
  }

  /**
   * Checks if the column placement is valid.
   * @param {string} puzzleString - The puzzle string.
   * @returns {boolean} True if the column placement is valid, false otherwise.
   */
  checkColPlacement(puzzleString) {
    let colArr = arrayCreator.createColArray(puzzleString);
    return arrayCreator.check(colArr);
  }

  /**
   * Checks if the region placement is valid.
   * @param {string} puzzleString - The puzzle string.
   * @returns {boolean} True if the region placement is valid, false otherwise.
   */
  checkRegionPlacement(puzzleString) {
    let regArr = arrayCreator.createRegArray(puzzleString);
    return arrayCreator.check(regArr);
  }

  /**
   * Solves the Sudoku puzzle.
   * @param {string} puzzleString - The puzzle string to solve.
   * @returns {string|object} The solved puzzle string or an error object.
   */
  solve(puzzleString) {
    try {
      return solver.solve(puzzleString);
    } catch (error) {
      return { error: error };
    }
  }
}

module.exports = new SudokuSolver;
