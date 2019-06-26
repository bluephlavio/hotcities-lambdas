const mongoose = require('mongoose');
const _ = require('lodash');
const { parseFilterQueryParam, parseSortQueryParam } = require('../helpers/parsers');

module.exports.matchMiddleware = () => (req, res, next) => {
  const {
    params: { id }
  } = req;
  res.match = { _id: mongoose.Types.ObjectId(id) };
  next();
};

module.exports.filterMiddleware = (...keys) => (req, res, next) => {
  const { query } = req;
  keys.forEach(key => {
    if (key in query) {
      const { [key]: value } = query;
      res.match = Object.assign(res.match || {}, parseFilterQueryParam(key)(value));
    }
  });
  next();
};

module.exports.sortMiddleware = () => (req, res, next) => {
  const { query } = req;
  if ('sort' in query) {
    const { sort: value } = query;
    res.sort = Object.assign(res.sort || {}, parseSortQueryParam(value));
  }
  next();
};

module.exports.paginationMiddleware = () => (req, res, next) => {
  const { query } = req;
  if ('skip' in query) {
    const { skip } = query;
    res.skip = parseInt(skip, 10);
  }
  if ('limit' in query) {
    const { limit } = query;
    res.limit = parseInt(limit, 10);
  }
  next();
};
