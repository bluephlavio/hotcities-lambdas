module.exports.extraMiddleware = (req, res, next) => {
  const { query } = req;
  if ('extra' in query) {
    const { extra: value } = query;
    res.extra = Object.assign({}, ...value.split(',').map(field => ({ [field]: 1 })));
  }
  next();
};
