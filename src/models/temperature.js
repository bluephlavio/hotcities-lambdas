const mongoose = require('mongoose');

const TemperatureSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Temperature', TemperatureSchema);
