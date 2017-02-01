var polishNotation = function(expression, extraOperators){
    if (expression.match(/[A-Za-z\.\,]/i)){
        throw new Error('Invalid expression! Not supported characters!');
    }
    expression = expression.replace(/\s+/g,' ').trim();
    
    var expressionElements = expression.split(' ');
    var allowedOperators = ['+','-','*'].concat(extraOperators);
    var elementStack = [];

    expressionElements.forEach(function(element) {
        var parsedElem = parseInt(element,10);
        if (Number.isInteger(parsedElem)){
            elementStack.push(element);
        }
        else {
            var lastValue = elementStack.pop();
            var firstValue = elementStack.pop();
            if (allowedOperators.indexOf(element)!= -1){
                return elementStack.push(eval(firstValue + element + lastValue));
            }
            throw new Error('Invalid expression! Not supported operators!');
        }
    });
    if (elementStack.length === 1 && !isNaN(elementStack[0])){
        return elementStack.pop();
    }
    throw new Error('Invalid expression! Incorrect count values or operators!')
};

module.exports.processExpression = polishNotation;