module.exports.list = model => async (req, res, next) => {
  try {
    const { match, sort, skip, limit } = res;
    const data = await model
      .find(match || {})
      .sort(sort || {})
      .skip(skip || 0)
      .limit(limit || 10);
    return res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};

module.exports.get = model => async (req, res, next) => {
  try {
    const { match } = res;
    const data = await model.findOne(match || {});
    return res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
