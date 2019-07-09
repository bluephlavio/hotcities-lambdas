const City = require('../models/city');
const Record = require('../models/record');
const Photo = require('../models/photo');

module.exports.live = () => async (req, res, next) => {
  try {
    const record = await Record.findOne({})
      .sort({ timestamp: 'desc' })
      .limit(1)
      .select('-__v -_id');
    const { geonameid } = record;
    const city = await City.findOne({ geonameid }).select('-__v -_id');
    const photos = await Photo.find({ geonameid })
      .limit(3)
      .select('-__v -_id');
    const hottestRecord = await Record.findOne({}).sort({ temp: 'desc' });
    const coolestRecord = await Record.findOne({}).sort({ temp: 'asc' });
    const { temp: maxTemp } = hottestRecord;
    const { temp: minTemp } = coolestRecord;
    res.status(200).json({
      record,
      city,
      photos,
      maxTemp,
      minTemp
    });
  } catch (err) {
    next(err);
  }
};
