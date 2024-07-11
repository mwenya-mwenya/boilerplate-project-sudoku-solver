const SudokuSolver = require('./controllers/sudoku-solver');
const arrayCreator = require('./arrayCreators');
const solver = require('./solverLogic.js');

const toSolve =  SudokuSolver;

let str = "1....5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."



/*  let col = toSolve.checkColPlacement(str);

let row = toSolve.checkRowPlacement(str);

let reg = toSolve.checkRegionPlacement(str);  
console.log(col,row,reg) */

  console.log(solver.solve(str))  


