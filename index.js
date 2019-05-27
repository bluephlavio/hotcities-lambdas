const fs = require('fs');
const _ = require('lodash');
const { getWeather } = require('./openweathermap');
const { admin, db } = require('./firebase');

const getGeonameids = async () => {
  try {
    const rawData = fs
      .readFileSync('./geonameids.csv')
      .toString()
      .trim();
    const lines = rawData.split('\n');
    const geonameids = _.map(lines, line => parseInt(line.trim()));
    return geonameids;
  } catch (err) {
    console.log(`getGeonameids:error:${err}`);
  }
};

const getRecord = async () => {
  try {
    const weather = await getWeather();
    const geonameids = await getGeonameids();
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
    console.log(`getRecord:error:${err}`);
  }
};

const saveRecord = async (geonameid, temperature) => {
  try {
    const timestamp = admin.firestore.FieldValue.serverTimestamp();
    const doc = await db.collection('records').add({
      geonameid,
      temperature,
      timestamp
    });
    const snapshot = await doc.get();
    const record = snapshot.data();
    return record;
  } catch (err) {
    console.log(`saveRecord:error:${err}`);
  }
};

const getAndSaveRecord = async () => {
  try {
    const { geonameid, temperature } = await getRecord();
    const record = await saveRecord(geonameid, temperature);
    return record;
  } catch (err) {
    console.log(`getAndSaveRecord:error:${err}`);
  }
};

module.exports = {
  getGeonameids,
  getRecord,
  saveRecord,
  getAndSaveRecord
};
