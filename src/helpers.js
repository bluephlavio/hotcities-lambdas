const _ = require('lodash');
const City = require('./models/city');
const Temperature = require('./model/temperature');

module.exports.getAllGeonameids = async () => {
  try {
    const cities = await City.find();
    const geonameids = cities.map(city => city.geonameid);
    return geonameids;
  } catch (err) {
    console.log(`getAllGeonameids:error:${err}`);
  }
};

module.exports.getMissingDataGeonameids = async () => {
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

module.exports.getOldDataGeonameids = async n => {
  try {
    const old = await Temperature.find().sort('timestamp').limit(n);
    return old;
  } catch (err) {
    console.log(`getMissingTemperatureGeonameids:error:${err}`);
  }
}

module.exports.toBeFetchedGeonameids = async () => {
  try {
    const missing = await getMissingDataGeonameids();
    const old = await getOldDataGeonameids(60 - missing.length);
    return _.concat(missing, old);
  } catch (err) {
    console.log(`toBeFetchedGeonameids:error:${err}`);
  }
};

module.exports.saveWeatherData = async data => {
  try {
    data.list.forEach(city => {
      const geonameid = city.id;
      const temp = city.main.temp;
      const timestamp = new Date();
      await Temperature.findOneAndUpdate({ geonameid }, { temp, timestamp });
    });
  } catch (err) {
    console.log(`saveWeatherData:error:${err}`);
  }
}

module.exports.getRecord = async () => {
  try {
    const temperatures = await Temperature.find();
    const recordTemp = _.max(temperatures.map(temperature => temperature.temp));
    const candidates = temperatures.filter(temperature => temperature.temp === recordTemp);
    const record = candidates[Math.floor(Math.random() * candidates.length)];
    return record;
  } catch (err) {
    console.log(`getRecord:error:${err}`);
  }
};

module.exports.saveRecord = async ({geonameid, temp}) => {
  try {
    await new Record({
      geonameid,
      temp
    }).save();
  } catch (err) {
    console.log(`saveRecord:error:${err}`);
  }
};
