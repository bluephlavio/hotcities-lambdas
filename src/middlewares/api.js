const mongoose = require('mongoose');
const _ = require('lodash');
const { parseFilterQueryParam } = require('../helpers/api');

module.exports.matchMiddleware = docId => (req, res, next) => {
  const { params } = req;
  const id = docId || params.id;
  res.match = Object.assign(res.match || {}, { _id: mongoose.Types.ObjectId(id) });
  next();
};

module.exports.filterMiddleware = (filterOpts, ...keys) => (req, res, next) => {
  const { query } = req;
  if (filterOpts) {
    res.match = Object.assign(res.match || {}, filterOpts);
  } else {
    for (const key of keys) {
      const value = query[key];
      if (value) {
        res.match = Object.assign(res.match || {}, parseFilterQueryParam(key)(value));
      }
    }
  }
  next();
};

module.exports.sortMiddleware = sortOpts => (req, res, next) => {
  const { query } = req;
  if (sortOpts) {
    res.sort = Object.assign(res.sort || {}, sortOpts);
  } else {
    const rules = query.sort ? query.sort.split(',') : null;
    if (rules) {
      res.sort = Object.assign(
        res.sort || {},
        ...rules.map(rule => (rule[0] == '-' ? { [rule.slice(1)]: -1 } : { [rule]: 1 }))
      );
    }
  }
  next();
};

module.exports.paginationMiddleware = paginationOpts => (req, res, next) => {
  const { query } = req;
  if (paginationOpts) {
    res.skip = paginationOpts.skip;
    res.limit = paginationOpts.limit;
  } else {
    res.skip = parseInt(query.skip, 10);
    res.limit = parseInt(query.limit, 10);
  }
  next();
};

module.exports.errorHandler = (err, req, res, next) => {
  res.status(400).send({ error: err.message });
};
