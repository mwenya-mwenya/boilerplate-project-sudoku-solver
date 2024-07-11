'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const { findPossibleNumbers } = require('../solverLogic.js');
const arrayCreator = require('../arrayCreators');
const sudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = SudokuSolver;

  // Route to check if a value is valid at a given coordinate in the puzzle
  app.route('/api/check')
    .post((req, res) => {
      // Destructure and obtain puzzle, value, and coordinate from the request body
      let { puzzle, value, coordinate } = req.body;    

      // Validate the presence of required fields
      if (!puzzle || !value || !coordinate) {
        return res.status(400).json({ error: 'Required field(s) missing' });
      }

      // Validate puzzle has numbers or periods

      if (!solver.validString(puzzle)) {
        return res.status(200).json({ error: 'Invalid characters in puzzle' })
      }

      // Validate puzzle string length
      if (!solver.validateStringLength(puzzle)) {
        return res.status(200).json({ error: 'Expected puzzle to be 81 characters long' })
      }

      let { colNum, rolNum } = solver.getCoodinates(coordinate)

      // Check if coordinates are within the 9x9 grid

      if (colNum < 0 || colNum > 8 || rolNum < 0 || rolNum > 8) {
        
        return res.status(400).json({ error: 'Invalid coordinate' });
      }

      // Validate the coordinates
      if (isNaN(colNum) || isNaN(rolNum)) {
       
        return res.status(400).json({ error: 'Invalid coordinate' });
      }

      if (isNaN(value) || value < 1 || value > 9) {
        return res.status(400).json({ error: 'Invalid value' });
      }

      if (!sudokuSolver.coordinateCheck(coordinate)) {
       
        return res.status(400).json({ error: 'Invalid coordinate' })
      }

      // Calculate the index in the puzzle string based on coordinates
      let { strIndex, regNum } = solver.getCoodinates(coordinate)
      
      if (puzzle[strIndex] === ".") {
        
        let valueNum = Number(value);
        let stringArr = puzzle.split('').map(char => char === '.' ? 0 : Number(char));

        const rowArr = arrayCreator.createRowArray(stringArr);
        const colArr = arrayCreator.createColArray(stringArr);
        const regArr = arrayCreator.createRegArray(stringArr);
        
        if (findPossibleNumbers(rowArr, colArr, regArr, rolNum, colNum).includes(valueNum)) {
          return res.status(400).json({ valid: true });
        } else {

          let row = rowArr[rolNum].includes(valueNum) ? "row" : null;
          let col = colArr[colNum].includes(valueNum) ? "column" : null;
          let reg = regArr[regNum].includes(valueNum) ? "region" : null;

          return res.status(400).json({
            valid: false,
            conflict: [row, col, reg].filter((a) => a !== null)
          });
        }
      }

      // Check if the provided value matches the value at the calculated index
      if (puzzle[strIndex] !== value.toString()) {
        return res.status(400).json({ valid: false });
      }

      // If all checks pass, the value is valid
      if (puzzle[strIndex] === value.toString()) {
        return res.status(200).json({ "valid": true });
      }
    });

  // Route to solve the entire puzzle
  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;

      // Validate the presence of required fields
      if (!puzzle) {
        return res.status(400).json({ error: 'Required field missing' });
      }

      // Validate puzzle string length
      if (puzzle.length !== 81) {
        return res.status(200).json({ error: 'Expected puzzle to be 81 characters long' })
      }

      // Validate puzzle has numbers or periods
      let puzzleCheck = /^[0-9.]+$/g.test(puzzle);
      if (!puzzleCheck) {
        return res.status(200).json({ error: 'Invalid characters in puzzle' })
      }

      // Solve the puzzle using the SudokuSolver
      let solvedPuzzle = solver.solve(puzzle);

      // Check if the puzzle was successfully solved 

      if (solvedPuzzle !== "No solution found") {
        // Respond with the solved puzzle

        return res.status(200).json({ solution: solvedPuzzle });
      } else {

        // Respond with an error if the puzzle could not be solved
        return res.status(200).json({ error: 'Puzzle cannot be solved' })
      }
    });
};
