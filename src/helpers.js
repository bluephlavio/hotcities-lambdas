const mongoose = require('mongoose');
const _ = require('lodash');
const City = require('./models/city');
const Temperature = require('./models/temperature');
const Record = require('./models/record');
const { MAX_CALLS_PER_MINUTE } = require('./openweathermap');
const config = require('./config');

const openDb = async () => {
  try {
    await mongoose.connect(config.mongo.connection, {
      useNewUrlParser: true,
      useFindAndModify: false
    });
  } catch (err) {
    console.log(`openDb: ${err}`);
    throw err;
  }
};

const closeDb = async () => {
  try {
    await mongoose.connection.close();
  } catch (err) {
    console.log(`closeDb: ${err}`);
    throw err;
  }
};

const getAllGeonameids = async () => {
  try {
    const cities = await City.find();
    const geonameids = cities.map(city => city.geonameid);
    return geonameids;
  } catch (err) {
    console.log(`getAllGeonameids: ${err}`);
    throw err;
  }
};

const getMissingDataGeonameids = async () => {
  try {
    const allGeonameids = await getAllGeonameids();
    const temperatures = await Temperature.find();
    const geonameids = temperatures.map(temperature => temperature.geonameid);
    const missing = allGeonameids.filter(geonameid => !_.includes(geonameids, geonameid));
    return missing;
  } catch (err) {
    console.log(`getMissingTemperatureGeonameids: ${err}`);
    throw err;
  }
};

const getOldDataGeonameids = async n => {
  try {
    const temperatures = await Temperature.find()
      .sort('timestamp')
      .limit(n);
    const old = temperatures.map(temperature => temperature.geonameid);
    return old;
  } catch (err) {
    console.log(`getMissingTemperatureGeonameids: ${err}`);
    throw err;
  }
};

const toBeFetchedGeonameids = async () => {
  try {
    const missing = await getMissingDataGeonameids();
    if (missing.length < MAX_CALLS_PER_MINUTE) {
      const old = await getOldDataGeonameids(MAX_CALLS_PER_MINUTE - missing.length);
      return _.concat(missing, old);
    }
    return _.slice(missing, 0, MAX_CALLS_PER_MINUTE);
  } catch (err) {
    console.log(`toBeFetchedGeonameids: ${err}`);
    throw err;
  }
};

const saveTemperatures = async temperatures => {
  try {
    const promises = temperatures.map(({ geonameid, temp, timestamp }) =>
      Temperature.findOneAndUpdate({ geonameid }, { temp, timestamp }, { upsert: true })
    );
    await Promise.all(promises);
  } catch (err) {
    console.log(`saveTemperatures: ${err}`);
    throw err;
  }
};

const getRecord = async () => {
  try {
    const temperatures = await Temperature.find();
    const allGeonameids = await getAllGeonameids();
    if (temperatures.length === allGeonameids.length) {
      const recordTemp = _.max(temperatures.map(temperature => temperature.temp));
      const candidates = temperatures.filter(temperature => temperature.temp === recordTemp);
      const record = candidates[Math.floor(Math.random() * candidates.length)];
      return record;
    }
    return null;
  } catch (err) {
    console.log(`getRecord: ${err}`);
    throw err;
  }
};

const saveRecord = async ({ geonameid, temp }) => {
  try {
    await new Record({
      geonameid,
      temp
    }).save();
  } catch (err) {
    console.log(`saveRecord: ${err}`);
    throw err;
  }
};

module.exports = {
  openDb,
  closeDb,
  getAllGeonameids,
  getMissingDataGeonameids,
  getOldDataGeonameids,
  toBeFetchedGeonameids,
  saveTemperatures,
  getRecord,
  saveRecord
};
