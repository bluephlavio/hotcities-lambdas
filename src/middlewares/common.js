const mongoose = require('mongoose');
const {
  parseFilterQueryParam,
  parseSortQueryParam
} = require('../helpers/parsers');

const ObjectId = mongoose.Types.ObjectId;

module.exports.matchMiddleware = extraIdField => (req, res, next) => {
  const {
    params: { id }
  } = req;
  if (id.length === 24) {
    res.match = { _id: ObjectId(id) };
    return next();
  } else if (extraIdField) {
    const { name, dtype } = extraIdField;
    try {
      if (dtype(id)) {
        res.match = { [name]: dtype(id) };
        return next();
      }
    } catch (err) {}
  }
  return next({ message: 'Not found.', code: 404 });
};

module.exports.filterMiddleware = (...keys) => (req, res, next) => {
  const { query } = req;
  keys.forEach(key => {
    if (key in query) {
      const { [key]: value } = query;
      res.match = Object.assign(
        res.match || {},
        parseFilterQueryParam(key)(value)
      );
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
