const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  localname: {
    type: String,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  countrycode: {
    type: String,
    required: true
  },
  population: {
    type: Number,
    required: true
  },
  lang: {
    type: String,
    required: true
  },
  timezone: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('City', CitySchema);
