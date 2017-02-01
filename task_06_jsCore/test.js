var assert = require('assert');
var polishNotation = require('./app.js');

describe('Input validation', function() {
    it('Letters in expression', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('as 3 +');
            },
            /Invalid expression! Not supported characters!/);
    });
    it('Letters in expression: without space', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('as as3 +');
            },
            /Invalid expression! Not supported characters!/);
    });
    it('Letters in expression: letters in digits', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('as 3as +');
            },
            /Invalid expression! Not supported characters!/);
    });
    it('Missing whitespace', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('3 3+');
            },
            /Invalid expression! Incorrect count values or operators!/);
    });
    it('Incorrect count of values', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('4 3 4 +');
            },
            /Invalid expression! Incorrect count values or operators!/);
    });
    it('Incorrect count of operators', function() {
        assert.throws(
             () => {
                polishNotation.processExpression('4 3 + +');
            },
            /Invalid expression! Incorrect count values or operators!/);
    });
    it('Float numbers', function() {
    assert.throws(
            () => {
            polishNotation.processExpression('3 3.33 +');
        },
        /Invalid expression! Not supported characters!/);
    });
});

describe('Expression tests', function(){
    it('Complex expression: 5 1 2 + 4 * + 3 -', function(){
         assert.equal(polishNotation.processExpression('5 1 2 + 4 * + 3 -'), 14);
    });
    it('Complex expression with extra operators: 5 1 2 + 4 % + 2 /', function(){
         assert.equal(polishNotation.processExpression('5 1 2 + 4 % + 2 /',['%','/']), 4);
    });
})