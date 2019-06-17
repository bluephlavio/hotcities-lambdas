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

module.exports = mongoose.model('Record', RecordSchema);
