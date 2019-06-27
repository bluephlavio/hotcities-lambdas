module.exports.errorHandler = (err, req, res, next) => {
  res.status(err.code || 500).send({ error: err.message });
};

module.exports.missingRouteHandler = (req, res, next) => {
  return next({ message: 'Not found.', code: 404 });
};
