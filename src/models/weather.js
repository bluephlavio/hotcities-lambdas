const mongoose = require('mongoose');
const _ = require('lodash');
const City = require('./city');
const Record = require('./record');

const WeatherSchema = new mongoose.Schema({
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

WeatherSchema.statics.list = async function() {
  return await this.find();
};

WeatherSchema.statics.temperatures = async function() {
  const weather = await this.list();
  return weather.map(entry => entry.temp);
};

WeatherSchema.statics.geonameids = async function() {
  const weather = await this.list();
  return weather.map(entry => entry.geonameid);
};

WeatherSchema.statics.findByGeonameid = async function(geonameid) {
  return await findOne({ geonameid });
};

WeatherSchema.statics.exists = async function(geonameid) {
  const result = await this.findByGeonameid(geonameid);
  return !!result;
};

WeatherSchema.statics.missingDataGeonameids = async function() {
  const allGeonameids = await City.geonameids();
  const geonameids = await this.geonameids();
  return _.filter(allGeonameids, geonameid => !_.includes(geonameids, geonameid));
};

WeatherSchema.statics.ready = async function() {
  const missing = await this.missingDataGeonameids();
  return missing.length == 0;
};

WeatherSchema.statics.withOlderDataGeonameids = async function(n) {
  const all = await this.find();
  older = _.chain(all)
    .sortBy('timestamp')
    .slice(0, n)
    .value();
  return older.map(entry => entry.geonameid);
};

WeatherSchema.statics.queue = async function(n) {
  const missing = await this.missingDataGeonameids();
  if (missing.length < n) {
    const older = await this.withOlderDataGeonameids(n - missing.length);
    return _.concat(missing, older);
  }
  return _.slice(missing, 0, n);
};

WeatherSchema.statics.update = async ({ geonameid, temp, timestamp }) => {
  return await this.findOneAndUpdate({ geonameid }, { temp, timestamp }, { upsert: true });
};

WeatherSchema.statics.bulkUpdate = async weather => {
  for (const entry of weather) {
    await this.update(entry);
  }
};

WeatherSchema.statics.maxTemp = async function() {
  const temperatures = await this.temperatures();
  return _.max(temperatures);
};

WeatherSchema.statics.hottests = async function() {
  const maxTemp = await this.maxTemp();
  return await this.find({ temp: maxTemp });
};

WeatherSchema.statics.record = async function() {
  const candidates = await this.hottests();
  const record = _.sample(candidates);
  return new record(record);
};

module.exports = mongoose.model('Weather', WeatherSchema);
