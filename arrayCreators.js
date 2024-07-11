class SudokuSolver {

    // Check if each sub-array has unique elements
    check(array) {
        return array.every(ele => new Set(ele).size === ele.length);
    }

    // Create an array of rows from the string representation of the puzzle
    createRowArray(str) {
        
        let strArray = Array.isArray(str) ? str: str.split('').map(Number);
        let rowArr = [];

        for (let i = 0; i < strArray.length; i += 9) {
            rowArr.push(strArray.slice(i, i + 9));
        }

        return rowArr;
    }

    // Create an array of columns from the string representation of the puzzle
    createColArray(str) {
        let strArray = Array.isArray(str) ? str: str.split('').map(Number);
        let colArr = Array.from({ length: 9 }, () => []);

        strArray.forEach((ele, index) => {
            let colIndex = index % 9;
            colArr[colIndex].push(ele);
        });

        return colArr;
    }

    // Create an array of 3x3 regions from the string representation of the puzzle
    createRegArray(str) {
        let strArray = Array.isArray(str) ? str: str.split('').map(Number);
        let regArr = Array.from({ length: 9 }, () => []);

        strArray.forEach((ele, index) => {
            let row = Math.floor(index / 9);
            let col = index % 9;
            let regIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

            regArr[regIndex].push(ele);
        });

        return regArr;
    }   

}

module.exports = new SudokuSolver();
