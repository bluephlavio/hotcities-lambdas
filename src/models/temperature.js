const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Temperature', TemperatureSchema);
