const mongoose = require('mongoose');
const _ = require('lodash');
const { parseQueryParamValue } = require('../helpers/api');

module.exports.buildCursorMiddleware = model => async (req, res, next) => {
  res.cursor = model.aggregate().project({
    __v: 0
  });
  next();
};

module.exports.matchMiddleware = () => (req, res, next) => {
  const { cursor } = res;
  cursor.match({ _id: mongoose.Types.ObjectId(req.params.id) });
  next();
};

module.exports.filterMiddleware = (...keys) => (req, res, next) => {
  const { cursor } = res;
  keys.forEach(key => {
    const v = req.query[key];
    if (v) {
      const values = parseQueryParamValue(v);
      values.forEach(value => {
        if (_.isArray(value)) {
          switch (value[0]) {
            case '>':
              cursor.match({ [key]: { $gt: value[1] } });
              break;
            case '<':
              cursor.match({ [key]: { $lt: value[1] } });
              break;
            default:
              break;
          }
        } else {
          cursor.match({ [key]: value });
        }
      });
    }
  });
  next();
};

module.exports.sortMiddleware = (...keys) => (req, res, next) => {
  const { query } = req;
  const { cursor } = res;
  const rules = keys.length
    ? keys
    : _.isArray(query.sort)
    ? query.sort
    : query.sort
    ? [query.sort]
    : [];
  if (rules.length) {
    const rulesObj = Object.assign(
      {},
      ...rules.map(rule => (rule[0] == '-' ? { [rule.slice(1)]: -1 } : { [rule]: 1 }))
    );
    cursor.sort(rulesObj);
  }
  next();
};

module.exports.paginationMiddleware = (...keys) => (req, res, next) => {
  const { cursor } = res;
  const skip = keys.length ? keys[0] : parseInt(req.query.skip, 10) || 0;
  if (skip) {
    cursor.skip(skip);
  }
  const limit = keys.length > 1 ? keys[1] : parseInt(req.query.limit, 10) || 0;
  if (limit) {
    cursor.limit(limit);
  }
  next();
};
