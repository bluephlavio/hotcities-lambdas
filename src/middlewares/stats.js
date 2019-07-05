const _ = require('lodash');
const Record = require('../models/record');

module.exports.extraMiddleware = () => (req, res, next) => {
  const { query } = req;
  if ('extra' in query) {
    const { extra: value } = query;
    res.extra = Object.assign(
      {},
      ...value.split(',').map(field => ({ [field]: 1 }))
    );
  }
  next();
};

module.exports.statsMiddleware = () => async (req, res, next) => {
  try {
    const count = await Record.count();
    const match = res.match || {};
    const sort = res.sort || { score: -1 };
    const skip = res.skip || 0;
    const limit = res.limit || count;
    const extra = res.extra || {};
    const stats = await Record.aggregate()
      .group({
        _id: '$geonameid',
        recordfrac: { $sum: 1 / count },
        recordtemp: { $max: '$temp' }
      })
      .lookup({
        from: 'cities',
        localField: '_id',
        foreignField: 'geonameid',
        as: 'city'
      })
      .unwind('$city')
      .addFields({
        'city.recordfrac': '$recordfrac',
        'city.recordtemp': '$recordtemp'
      })
      .replaceRoot('$city')
      .project({
        _id: 1,
        geonameid: 1,
        ...extra,
        recordfrac: 1,
        recordtemp: 1
      })
      .addFields({
        score: { $multiply: ['$recordfrac', '$recordtemp'] }
      })
      .match(match)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
    const recordfracs = stats.map(item => item.recordfrac);
    const recordtemps = stats.map(item => item.recordtemp);
    const maxRecordFrac = _.max(recordfracs);
    const maxRecordTemp = _.max(recordtemps);
    const scoreNormalization = maxRecordFrac * maxRecordTemp;
    const data = stats.map(({ score, ...rest }) => ({
      ...rest,
      score: score / scoreNormalization
    }));
    res.stats = data;
    console.log(data);
    next();
  } catch (err) {
    next(err);
  }
};
