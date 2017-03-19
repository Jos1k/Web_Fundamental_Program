const express = require('express');
const cors = require('cors');
const dataRepository = require('./custom_modules/dataRepository');

const app = express();
const port = 8082;

app.post('/api/search', cors(), function (req, res) {
    res.json(dataRepository.find(req.query.query));
});
app.listen(port);