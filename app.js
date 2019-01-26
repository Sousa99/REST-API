const express = require('express');
const app = express();

app.use( (req, res, next) => {
    res.status(200).json({
        author: 'Rodrigo Sousa',
        to: 'Fernando Sousa',
        message: 'Hello Brave New World!'
    });
});

module.exports = app;