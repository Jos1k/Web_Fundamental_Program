var express = require('express');
var app = express();

var port = process.env.PORT || 8082;
var router = express.Router();

var dataStorage = ["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"];

var containsFilter = function (query) {
    return dataStorage.filter((value) => { 
        return value.toUpperCase().includes(query.toUpperCase()) 
    });
}

router.post('/search', function (req, res) {
    res.json(containsFilter(req.query.query));
});

app.use('/api', router);
app.use(express.static('static'))

app.listen(port);
console.log('Server started on port:' + port);