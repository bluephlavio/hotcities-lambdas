const Record = require('../models/record');

module.exports.current = () => async (req, res, next) => {
  try {
    const data = await Record.last();
    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};
