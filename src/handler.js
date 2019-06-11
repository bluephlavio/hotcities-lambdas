const { getTemperatures } = require('./openweathermap');
const {
  openDb,
  closeDb,
  toBeFetchedGeonameids,
  saveTemperatures,
  allTemperaturesFetched,
  getRecord,
  getCityByGeonameid,
  saveRecord
} = require('./helpers');
const { MAX_CALLS_PER_MINUTE } = require('./openweathermap');

module.exports.fetcher = async () => {
  try {
    await openDb();
    console.log('Connected to db.');
    const geonameids = await toBeFetchedGeonameids(MAX_CALLS_PER_MINUTE);
    console.log(`${geonameids.length} geonameids selected for fetching temperature data.`);
    const temperatures = await getTemperatures(geonameids);
    console.log(`${temperatures.length} temperature data fetched from openweathermap.`);
    await saveTemperatures(temperatures);
    console.log('Temperature data saved to db.');
    await closeDb();
    console.log('Database connection closed.');
  } catch (err) {
    console.log(`fetcher: ${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await openDb();
    console.log('Connected to db.');
    const isOk = await allTemperaturesFetched();
    console.log(`Data ${isOk ? '' : 'not'} fetched for all cities.`);
    if (isOk) {
      const record = await getRecord();
      const { temp, geonameid } = record;
      const { name } = getCityByGeonameid(geonameid);
      console.log(`Record temperature found: ${temp} in ${name}!`);
      await saveRecord(record);
      console.log('Record saved to db.');
    }
    await closeDb();
  } catch (err) {
    console.log(`recorder: ${err}`);
  }
};
