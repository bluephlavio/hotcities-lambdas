const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  geonameid: {
    type: Number,
    ref: 'City',
  },
  temp: {
    type: Number,
  },
});

module.exports = mongoose.model('Temperature', TemperatureSchema);