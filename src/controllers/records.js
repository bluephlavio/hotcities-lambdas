const Record = require('../models/record');
const City = require('../models/city');

module.exports.current = () => async (req, res, next) => {
  try {
    const data = await Record.findOne()
      .sort('-timestamp')
      .select(['-__v']);
    const { geonameid } = data;
    const city = await City.findOne({ geonameid });
    const dataWithExtras = Object.assign(
      data.toObject(),
      ...dataWithExtras.map()
    );
    if (!data) return next({ message: 'Not found.', code: 404 });
    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};

module.exports.record = () => async (req, res, next) => {
  try {
    const data = await Record.findOne()
      .sort('-temp')
      .select(['-__v']);
    if (!data) return next({ message: 'Not found.', code: 404 });
    res.status(200).send({ data });
  } catch (err) {
    next(err);
  }
};
