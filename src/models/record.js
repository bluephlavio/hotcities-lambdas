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
  return await this.find()
    .sort({ timestamp: 'desc' })
    .limit(1);
};

RecordSchema.statics.first = async function() {
  return await this.find()
    .sort({ timestamp: 'asc' })
    .limit(1);
};

RecordSchema.statics.last = async function() {
  return await this.find()
    .sort({ timestamp: 'desc' })
    .limit(1);
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

RecordSchema.statics.hottests = async function(from, to) {
  const candidates = await this.find()
    .sort({ timestamp: 'asc' })
    .where('timestamp')
    .gt(from)
    .lt(to);
  const maxTemp = _.max(candidates.map(candidate => candidate.temp));
  return _.filter(candidates, candidate => candidate.temp == maxTemp);
};

RecordSchema.statics.allTimeHottests = async function() {
  const from = await this.startTime();
  const to = await this.stopTime();
  return await this.hottests(from, to);
};

module.exports = mongoose.model('Record', RecordSchema);
