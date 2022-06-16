const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  localname: {
    type: String,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  countryname: {
    type: String,
    required: true,
  },
  countrycode: {
    type: String,
    required: true,
  },
  population: {
    type: Number,
    required: true,
  },
  lang: {
    type: String,
  },
  timezone: {
    type: String,
  },
});

CitySchema.virtual('names').get(function () {
  const names = [this.name];
  if (this.localname && this.localname !== this.name) {
    names.push(this.localname);
  }
  return names;
});

CitySchema.statics.list = async function () {
  return await this.find();
};

CitySchema.statics.findByGeonameid = async function (geonameid) {
  return await this.findOne({ geonameid });
};

CitySchema.statics.geonameids = async function () {
  const cities = await this.list();
  return cities.map((city) => city.geonameid);
};

module.exports = mongoose.model('City', CitySchema);
