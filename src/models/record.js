const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  geonameid: {
    type: Number
  },
  temp: {
    type: Number
  }
});

module.exports = mongoose.model('Record', RecordSchema);
