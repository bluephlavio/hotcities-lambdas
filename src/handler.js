const mongoose = require('mongoose');
const { getWeather } = require('./openweathermap');
const { toBeFetchedGeonameids, saveWeatherData, getRecord, saveRecord } = require('./helpers');
const config = require('./config');

module.exports.fetcher = async () => {
  try {
    await mongoose.connect(config.mongo.connection, {
      useNewUrlParser: true,
      useFindAndModify: false
    });
    const geonameids = await toBeFetchedGeonameids();
    const data = await getWeather(geonameids);
    await saveWeatherData(data);
    await mongoose.connection.close();
  } catch (err) {
    console.log(`fetcher:error:${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await mongoose.connect(config.mongo.connection, {
      useNewUrlParser: true,
      useFindAndModify: false
    });
    const record = await getRecord();
    if (record) {
      await saveRecord(record);
    }
    await mongoose.connection.close();
  } catch (err) {
    console.log(`recorder:error:${err}`);
  }
};
