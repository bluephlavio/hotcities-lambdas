const mongoose = require('mongoose');

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

module.exports = mongoose.model('Record', RecordSchema);
