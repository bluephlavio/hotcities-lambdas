const _ = require('lodash');
const Record = require('../models/record');

module.exports.getRanking = async () => {
  const count = await Record.countDocuments();
  const data = await Record.aggregate()
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
      'city.recordtemp': '$recordtemp',
      'city.score': { $multiply: ['$recordfrac', '$recordtemp'] }
    })
    .replaceRoot('$city')
    .exec();
  const recordfracs = data.map(item => item.recordfrac);
  const recordtemps = data.map(item => item.recordtemp);
  const maxRecordFrac = _.max(recordfracs);
  const maxRecordTemp = _.max(recordtemps);
  const scoreNormalization = maxRecordFrac * maxRecordTemp;
  return _.chain(data)
    .map(({ score, ...rest }) => ({
      ...rest,
      score: score / scoreNormalization
    }))
    .orderBy(['score'], ['desc'])
    .map((entry, i) => ({
      ...entry,
      rank: i + 1
    }))
    .value();
};
