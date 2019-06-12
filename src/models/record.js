const mongoose = require('mongoose');
const Weather = require('./weather');

const RecordSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  geonameid: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  }
});

RecordSchema.statics.register = async function() {
  const record = await Weather.record();
  return await this.create(record);
};

module.exports = mongoose.model('Record', RecordSchema);
