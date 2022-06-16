module.exports.errorHandler = (err, req, res, next) => {
  console.log(err);
  const { code } = err;
  res
    .status(code > 100 && code < 600 ? code : 500)
    .send({ error: err.message });
};

module.exports.missingRouteHandler = (req, res, next) => {
  return next({ message: 'Not found.', code: 404 });
};
