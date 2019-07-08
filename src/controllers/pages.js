const City = require('../models/city');
const Record = require('../models/record');
const Photo = require('../models/photo');

module.exports.liveController = () => async (req, res, next) => {
  try {
    const record = await Record.last();
  } catch (err) {
    next(err);
  }
};
