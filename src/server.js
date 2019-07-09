const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const { missingRouteHandler, errorHandler } = require('./middlewares/error');

const db = require('./db');

db.open();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', require('./routes/all'));
app.use(missingRouteHandler);
app.use(errorHandler);

module.exports.app = app;
module.exports.handler = serverless(app);
