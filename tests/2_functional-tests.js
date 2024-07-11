const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    // test variables 
    const validPuzzleString = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';
    const validPuzzleStringSolution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943';

    const invalidPuzzleStringLength = '5.91372.3...8.5.9.9.25';
    const invalidPuzzleStringChar = '*..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3';

    const unsolvablePuzzle = '1....5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: validPuzzleString })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, validPuzzleStringSolution);
                done();
            });
    });

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.strictEqual(res.body.error, "Required field missing");
                done();
            });
    });

    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invalidPuzzleStringChar })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.error, "Invalid characters in puzzle");
                done();
            });
    });

    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: invalidPuzzleStringLength })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            });
    });

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({ puzzle: unsolvablePuzzle })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.error, "Puzzle cannot be solved");
                done();
            });
    });

    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a1',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isTrue(res.body.valid);
                done();
            });
    });

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a2',
                value: '1'
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.isObject(res.body);
                assert.deepEqual(res.body, { "valid": false, "conflict": ["row"] })
                done();
            });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a2',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.isObject(res.body);
                assert.deepEqual(res.body, { "valid": false, "conflict": ["row", "column", "region"] })
                done();
            });
    });

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a2',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.isObject(res.body);
                assert.deepEqual(res.body, { "valid": false, "conflict": ["row", "column", "region"] })
                done();
            });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a2'
                /// missing value            
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.strictEqual(res.body.error, "Required field(s) missing")
                done();
            });
    });

    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: invalidPuzzleStringChar,
                coordinate: 'a2',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.error, "Invalid characters in puzzle")
                done();
            });
    });

    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: invalidPuzzleStringLength,
                coordinate: 'a2',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.strictEqual(res.body.error, "Expected puzzle to be 81 characters long")
                done();
            });
    });

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'z2',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.strictEqual(res.body.error, "Invalid coordinate")
                done();
            });
    });

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                puzzle: validPuzzleString,
                coordinate: 'a10',
                value: '9'
            })
            .end(function (err, res) {
                assert.equal(res.status, 400);
                assert.strictEqual(res.body.error, "Invalid coordinate")
                done();
            });
    });

});

