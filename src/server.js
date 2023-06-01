const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const serverless = require('serverless-http');
const { missingRouteHandler, errorHandler } = require('./middlewares/error');
const restApi = require('./routes/all');
const graphqlApi = require('./graphql/api');
const db = require('./db');

db.open();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', restApi);
app.use('/graphql', graphqlApi);
app.use(missingRouteHandler);
app.use(errorHandler);

module.exports.app = app;
module.exports.handler = serverless(app);
