const { getWeather } = require('./openweathermap');
const {
  openDb,
  closeDb,
  toBeFetchedGeonameids,
  saveWeatherData,
  getRecord,
  saveRecord
} = require('./helpers');

module.exports.fetcher = async () => {
  try {
    await openDb();
    const geonameids = await toBeFetchedGeonameids();
    const data = await getWeather(geonameids);
    await saveWeatherData(data);
    await closeDb();
  } catch (err) {
    console.log(`fetcher:error:${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await openDb();
    const record = await getRecord();
    if (record) {
      await saveRecord(record);
    }
    await closeDb();
  } catch (err) {
    console.log(`recorder:error:${err}`);
  }
};
