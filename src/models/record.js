const mongoose = require('mongoose');
const _ = require('lodash');

const RecordSchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

RecordSchema.statics.current = async function() {
  return await this.findOne().sort({ timestamp: 'desc' });
};

RecordSchema.statics.first = async function() {
  return await this.findOne().sort({ timestamp: 'asc' });
};

RecordSchema.statics.last = async function() {
  return await this.findOne().sort({ timestamp: 'desc' });
};

RecordSchema.statics.startTime = async function() {
  const first = await this.first();
  const { timestamp } = first;
  return timestamp;
};

RecordSchema.statics.stopTime = async function() {
  const last = await this.last();
  const { timestamp } = last;
  return timestamp;
};

RecordSchema.statics.hottest = async function() {
  return await this.findOne().sort({ temp: 'desc' });
};

RecordSchema.statics.coolest = async function() {
  return await this.findOne().sort({ temp: 'asc' });
};

RecordSchema.statics.tempRange = async function() {
  const { temp: minTemp } = await this.coolest();
  const { temp: maxTemp } = await this.hottest();
  return [minTemp, maxTemp];
};

RecordSchema.statics.ranking = async function() {
  const count = await this.countDocuments();
  const data = await this.aggregate()
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
    .exec();
  console.log(`record.ranking.data: ${data}`);
  const recordfracs = data.map(item => item.recordfrac);
  const maxRecordFrac = _.max(recordfracs);
  const [minTemp, maxTemp] = await this.tempRange();
  return _.chain(data)
    .map(({ score, recordfrac, recordtemp, ...rest }) => ({
      ...rest,
      recordfrac,
      recordtemp,
      score:
        (recordfrac / maxRecordFrac) *
        ((recordtemp - minTemp) / (maxTemp - minTemp))
    }))
    .orderBy(['score'], ['desc'])
    .map((entry, i) => ({
      ...entry,
      rank: i + 1
    }))
    .value();
};

module.exports = mongoose.model('Record', RecordSchema);
