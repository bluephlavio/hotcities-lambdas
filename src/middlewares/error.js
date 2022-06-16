module.exports.errorHandler = (err, req, res, next) => {
  const { code, message } = err;
  res.status(code > 100 && code < 600 ? code : 500).send({ error: message });
};

module.exports.missingRouteHandler = (req, res, next) => {
  return next({ message: 'Not found.', code: 404 });
};
