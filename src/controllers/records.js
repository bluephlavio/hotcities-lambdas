const Record = require('../models/record');

module.exports.current = () => async (req, res, next) => {
  try {
    const data = await Record.findOne()
      .sort('-timestamp')
      .select(['-__v']);
    if (!data) return next({ massage: 'Not found.', code: 404 });
    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};
