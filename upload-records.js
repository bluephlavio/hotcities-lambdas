const fs = require('fs');
const _ = require('lodash');
const { db, admin } = require('./firebase');

const rawData = fs
  .readFileSync('./records.csv')
  .toString()
  .trim();
const lines = rawData.split('\n');
const records = _.map(lines, line => {
  const data = line.split(',');
  const geonameid = parseInt(data[0]);
  const temp = parseInt(data[1]);
  const date = new Date(data[2]);
  const seconds = parseInt(date.getTime() / 1000);
  const timestamp = new admin.firestore.Timestamp(seconds, 0);
  return {
    geonameid,
    temp,
    timestamp
  };
});

records.forEach(record => {
  db.collection('records').add(record);
});

console.log(records);
