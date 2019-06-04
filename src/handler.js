const mongoose = require('mongoose');
const { getWeather } = require('./openweathermap');
const { toBeFetchedGeonameids, saveWeatherData, getRecord, saveRecord } = require('./helpers');
const config = require('./config');

module.exports.fetcher = async () => {
  try {
    await mongoose.connect(config.mongo.connection);
    const geonameids = await toBeFetchedGeonameids();
    const data = await getWeather(geonameids);
    await saveWeatherData(data);
  } catch (err) {
    console.log(`fetcher:error:${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await mongoose.connect(config.mongo.connection);
    const record = await getRecord();
    await saveRecord(record);
  } catch (err) {
    console.log(`recorder:error:${err}`);
  }
};
