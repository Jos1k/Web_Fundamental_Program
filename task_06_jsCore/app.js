var polishNotation = function(expression, extraOperators){
    var allowedOperators = '+-*';
    var elementStack = [];
    var result = 0;
    if (expression.match(/[A-Za-z\.\,]/i)){
        throw new Error('Invalid expression! Not supported characters!');
    }
    expression = expression.replace(/\s+/g,' ').trim();
    var expressionElements = expression.split(' ');

    expressionElements.forEach(function(element) {
        var parsedElem = parseInt(element,10);
        if (!isNaN (parsedElem )){
            elementStack.push(parsedElem);
        }
        else {
            var lastValue = elementStack.pop();
            var firstValue = elementStack.pop();
            if (allowedOperators.indexOf(element)!= -1 
                || (extraOperators && extraOperators.indexOf(element)!=-1)){
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