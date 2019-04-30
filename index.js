const _ = require('lodash');
const { getWeather } = require('./openweathermap');
const { admin, db } = require('./firebase');

const getCities = async () => {
  try {
    const snapshot = await db.collection('cities').get();
    const cities = _.map(snapshot.docs, doc => doc.data());
    return cities;
  } catch (err) {
    console.log(err);
  }
};

const getRecord = async () => {
  try {
    const weather = await getWeather();
    const cities = await getCities();
    const geonameids = _.map(cities, city => parseInt(city.geonameid));
    const availables = _.filter(weather, entry => _.includes(geonameids, parseInt(entry.id)));
    const temperatures = _.map(availables, entry => entry.main.temp);
    const maxTemp = _.max(temperatures);
    const candidates = _.filter(availables, entry => entry.main.temp === maxTemp);
    const {
      id,
      main: { temp }
    } = candidates[Math.floor(Math.random() * candidates.length)];
    const record = {
      geonameid: id,
      temperature: temp
    };
    return record;
  } catch (err) {
    console.log(err);
  }
};

const saveRecord = async (geonameid, temperature) => {
  try {
    const doc = await db.collection('records').add({
      geonameid,
      temperature,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    const snapshot = await doc.get();
    const record = snapshot.data();
    return record;
  } catch (err) {
    console.log(err);
  }
};

const getAndSaveRecord = async () => {
  try {
    const { geonameid, temperature } = await getRecord();
    const record = await saveRecord(geonameid, temperature);
    return record;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  getCities,
  getRecord,
  saveRecord,
  getAndSaveRecord
};
