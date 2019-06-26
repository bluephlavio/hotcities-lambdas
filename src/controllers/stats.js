const City = require('../models/city');
const Record = require('../models/record');

module.exports.stats = () => async (req, res, next) => {
  try {
    const count = await Record.count();
    const data = count;
    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};
