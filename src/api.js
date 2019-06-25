const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const router = require('./routes/api');
const db = require('./db');

db.open();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

module.exports = serverless(app, {
  request: function(req, event, context) {
    req.event = event;
    req.context = context;
  }
});
