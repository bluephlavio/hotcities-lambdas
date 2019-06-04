const _ = require('lodash');
const City = require('./models/city');
const Temperature = require('./models/temperature');
const { MAX_CITIES_PER_CALL } = require('./openweathermap');

const getAllGeonameids = async () => {
  try {
    const cities = await City.find();
    const geonameids = cities.map(city => city.geonameid);
    return geonameids;
  } catch (err) {
    console.log(`getAllGeonameids:error:${err}`);
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
    console.log(`getMissingTemperatureGeonameids:error:${err}`);
  }
}

const getOldDataGeonameids = async n => {
  try {
    const temperatures = await Temperature.find().sort('timestamp').limit(n);
    const old = temperatures.map(temperature => temperature.geonameid);
    return old;
  } catch (err) {
    console.log(`getMissingTemperatureGeonameids:error:${err}`);
  }
}

const toBeFetchedGeonameids = async () => {
  try {
    const missing = await getMissingDataGeonameids();
    if (missing.length < MAX_CITIES_PER_CALL) {
      const old = await getOldDataGeonameids(MAX_CITIES_PER_CALL - missing.length);
      return _.concat(missing, old);
    }
    return _.slice(missing, 0, MAX_CITIES_PER_CALL);
  } catch (err) {
    console.log(`toBeFetchedGeonameids:error:${err}`);
  }
};

const cleanWeatherData = data => {
  try {
    const cleanedData = data.list.map(city => {
      const geonameid = city.id;
      const temp = city.main.temp;
      const timestamp = new Date();
      return { geonameid, temp, timestamp };
    });
    return cleanedData;
  } catch (err) {
    console.log(`cleanWeatherData:error:${err}`);
  }
}

const saveWeatherData = async data => {
  try {
    const cleanedData = cleanWeatherData(data);
    const promises = cleanedData.map(city => {
      const { geonameid, temp, timestamp } = city;
      return Temperature.findOneAndUpdate({ geonameid }, { temp, timestamp });
    });
    await Promise.all(promises);
  } catch (err) {
    console.log(`saveWeatherData:error:${err}`);
  }
}

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
    console.log(`getRecord:error:${err}`);
  }
};

const saveRecord = async ({geonameid, temp}) => {
  try {
    await new Record({
      geonameid,
      temp
    }).save();
  } catch (err) {
    console.log(`saveRecord:error:${err}`);
  }
};

module.exports = {
  getAllGeonameids,
  getMissingDataGeonameids,
  getOldDataGeonameids,
  toBeFetchedGeonameids,
  cleanWeatherData,
  saveWeatherData,
  getRecord,
  saveRecord
};