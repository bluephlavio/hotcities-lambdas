require('dotenv').config();

const _ = require('lodash');
const { getWeather } = require('./openweathermap');
const { admin, db } = require('./firebase');

const getCities = () => {
  return db
    .collection('cities')
    .get()
    .then(snapshot => {
      return _.map(snapshot.docs, doc => {
        return doc.data();
      });
    });
};

const getRecord = async () => {
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
};

const saveRecord = (geonameid, temperature) => {
  return db
    .collection('records')
    .add({
      geonameid,
      temperature,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(doc => {
      return doc.get();
    })
    .then(snapshot => {
      return snapshot.data();
    });
};

const getAndSaveRecord = async () => {
  const { geonameid, temperature } = await getRecord();
  const record = await saveRecord(geonameid, temperature);
  return record;
};

module.exports = {
  getCities,
  getRecord,
  saveRecord,
  getAndSaveRecord
};
