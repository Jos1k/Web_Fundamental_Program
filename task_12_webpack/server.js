const express = require('express');
const cors = require('cors');
const dataRepository = require('./custom_modules/dataRepository');

const app = express();
const port = process.env.PORT || 8082;

app.post('/api/search', cors(), function (req, res) {
    res.json(dataRepository.find(req.query.query));
});
app.use(express.static('static'));
app.listen(port);

console.log('Server started on port:' + port);