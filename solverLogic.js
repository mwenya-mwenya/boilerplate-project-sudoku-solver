const arrayCreator = require('./arrayCreators');


// Helper function to find the index of the 3x3 region that a cell belongs to
const findBoxIndex = (row, col) => {
  let boxRow = Math.floor(row / 3);
  let boxCol = Math.floor(col / 3);
  return boxRow * 3 + boxCol;
};

class solverLogic {
  // Method to solve the puzzle represented as a string
  solve(str) {
    

    // Convert the string into an array of numbers, replacing '.' with 0
    let stringArr = str.split('').map(char => char === '.' ? 0 : Number(char));
    let failed = false; // Flag to indicate if the puzzle cannot be solved

    // Create arrays representing rows, columns, and regions (3x3 subgrids) of the puzzle
    const rowArr = arrayCreator.createRowArray(stringArr);
    const colArr = arrayCreator.createColArray(stringArr);
    const regArr = arrayCreator.createRegArray(stringArr);

    // Check if the initial puzzle is valid
    if (!this.isValidPuzzle(rowArr, colArr, regArr)) {
      return "No solution found";
    }

    // Attempt to solve the puzzle
    do {
      // Iterate over each cell in the puzzle
      for (let i = 0; i < stringArr.length; i++) {
        if (stringArr[i] === 0) { // Check if the current cell is empty
          let rowNum = Math.floor(i / 9);
          let colNum = i % 9;
          // Find possible numbers for the current cell
          let tempArr = this.findPossibleNumbers(rowArr, colArr, regArr, rowNum, colNum);

          // If there is only one possible number, fill it in the current cell
          if (tempArr.length === 1) {
            stringArr[i] = tempArr[0];
            // Update the row, column, and region arrays with the new number
            rowArr[rowNum][colNum] = tempArr[0];
            colArr[colNum][rowNum] = tempArr[0];
            regArr[findBoxIndex(rowNum, colNum)][(rowNum % 3) * 3 + (colNum % 3)] = tempArr[0];
          } else if (tempArr.length === 0) { // If there are no possible numbers, set the failed flag to true
            failed = true;
            break;
          }
        }
      }
    } while (stringArr.includes(0) && !failed); // Continue until there are no more empty cells or the puzzle is unsolvable

    // Return the solved puzzle as a string or a failure message
    return failed ? "No solution found" : stringArr.join('');
  }

  // Method to validate the initial state of the puzzle
  isValidPuzzle(rowArr, colArr, regArr) {
    // Check if each row, column, and region has unique numbers (excluding 0)
    let check = (array) => array.every(ele => new Set(ele.filter((a) => a !== 0)).size === ele.filter((b) => b !== 0).length);
    return check(rowArr) && check(colArr) && check(regArr);
  }

  // Method to determine the possible numbers for a given cell
  findPossibleNumbers(rowArr, colArr, regArr, rowNum, colNum) {
    // All possible numbers in a Sudoku puzzle
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Filter out numbers that are already present in the corresponding row, column, and region
    return nums.filter(ele =>
      !rowArr[rowNum].includes(ele) &&
      !colArr[colNum].includes(ele) &&
      !regArr[findBoxIndex(rowNum, colNum)].includes(ele)
    );
  }
}

// Export the solverLogic class instance for use in other modules
module.exports = new solverLogic();
