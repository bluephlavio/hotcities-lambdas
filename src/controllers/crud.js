module.exports.list = model => async (req, res, next) => {
  try {
    const match = res.match || {};
    const sort = res.sort || {};
    const skip = res.skip || 0;
    const limit = res.limit || 0;
    const data = await model
      .find(match)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    return res.status(200).json({ data, pagination: { skip, limit } });
  } catch (err) {
    next(err);
  }
};

module.exports.get = model => async (req, res, next) => {
  try {
    const match = res.match || {};
    const data = await model.findOne(match);
    return res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
};
