const _ = require('lodash');
const City = require('../models/city');
const Record = require('../models/record');
const Photo = require('../models/photo');
const { getStats } = require('../helpers/stats');

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
    const allStats = await getStats();
    const stats = _.chain(allStats)
      .map(({ geonameid, recordfrac, recordtemp, score, rank }) => ({
        geonameid,
        recordfrac,
        recordtemp,
        score,
        rank
      }))
      .find(entry => entry.geonameid === geonameid)
      .value();
    const { temp: maxTemp } = hottestRecord;
    const { temp: minTemp } = coolestRecord;
    const range = { minTemp, maxTemp };
    res.status(200).json({
      record: Object.assign(record.toObject(), city.toObject()),
      photos,
      stats,
      range
    });
  } catch (err) {
    next(err);
  }
};
