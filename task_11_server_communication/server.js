const express = require('express');
const dataRepository = require('./custom_modules/dataRepository');

const app = express();
const port = process.env.PORT || 8082;
const router = express.Router();

router.post('/search', function (req, res) {
    res.json(dataRepository.find(req.query.query));
});

app.use('/api', router);
app.use(express.static('static'))

app.listen(port);
console.log('Server started on port:' + port);