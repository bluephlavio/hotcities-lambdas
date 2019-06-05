const { getTemperatures } = require('./openweathermap');
const {
  openDb,
  closeDb,
  toBeFetchedGeonameids,
  saveTemperatures,
  getRecord,
  saveRecord
} = require('./helpers');

module.exports.fetcher = async () => {
  try {
    await openDb();
    const geonameids = await toBeFetchedGeonameids();
    console.log(geonameids);
    const temperatures = await getTemperatures(geonameids);
    console.log(temperatures);
    await saveTemperatures(temperatures);
    await closeDb();
  } catch (err) {
    console.log(`fetcher: ${err}`);
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
    console.log(`recorder: ${err}`);
  }
};
