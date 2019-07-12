const Record = require('../models/record');
const City = require('../models/city');

module.exports.current = () => async (req, res, next) => {
  try {
    const extra = res.extra || [];
    const data = await Record.findOne()
      .sort({ timestamp: 'desc' })
      .select(['-__v']);
    if (!data) return next({ message: 'Not found.', code: 404 });
    const { geonameid } = data;
    const city = await City.findOne({ geonameid });
    return res.status(200).json({
      data: Object.assign(
        data.toObject(),
        ...extra.map(field => ({ [field]: city[field] }))
      )
    });
  } catch (err) {
    next(err);
  }
};

module.exports.hottest = () => async (req, res, next) => {
  try {
    const extra = res.extra || [];
    const data = await Record.findOne()
      .sort({ temp: 'desc' })
      .select(['-__v']);
    const { geonameid } = data;
    const city = await City.findOne({ geonameid });
    if (!data) return next({ message: 'Not found.', code: 404 });
    return res.status(200).json({
      data: Object.assign(
        data.toObject(),
        ...extra.map(field => ({ [field]: city[field] }))
      )
    });
  } catch (err) {
    next(err);
  }
};

module.exports.coolest = () => async (req, res, next) => {
  try {
    const extra = res.extra || [];
    const data = await Record.findOne()
      .sort({ temp: 'asc' })
      .select(['-__v']);
    const { geonameid } = data;
    const city = await City.findOne({ geonameid });
    if (!data) return next({ message: 'Not found.', code: 404 });
    return res.status(200).json({
      data: Object.assign(
        data.toObject(),
        ...extra.map(field => ({ [field]: city[field] }))
      )
    });
  } catch (err) {
    next(err);
  }
};
