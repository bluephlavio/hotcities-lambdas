const City = require('./models/city');

module.exports.getGeonameids = async () => {
  try {
    const cities = await City.find();
    const geonameids = cities.map(city => city.geonameid);
    return geonameids;
  } catch (err) {
    console.log(`getGeonameids:error:${err}`);
  }
};

// const getRecord = async () => {
//   try {
//     const weather = await getWeather();
//     const geonameids = await getGeonameids();
//     const availables = _.filter(weather, entry => _.includes(geonameids, parseInt(entry.id)));
//     const temperatures = _.map(availables, entry => entry.main.temp);
//     const maxTemp = _.max(temperatures);
//     const candidates = _.filter(availables, entry => entry.main.temp === maxTemp);
//     const {
//       id,
//       main: { temp }
//     } = candidates[Math.floor(Math.random() * candidates.length)];
//     const record = {
//       geonameid: id,
//       temp,
//     };
//     return record;
//   } catch (err) {
//     console.log(`getRecord:error:${err}`);
//   }
// };

// const saveRecord = async (geonameid, temp) => {
//   try {
//     const record = await new Record({
//       geonameid,
//       temp
//     }).save();
//     return record;
//   } catch (err) {
//     console.log(`saveRecord:error:${err}`);
//   }
// };

// const getAndSaveRecord = async () => {
//   try {
//     const { geonameid, temp } = await getRecord();
//     const record = await saveRecord(geonameid, temp);
//     return record;
//   } catch (err) {
//     console.log(`getAndSaveRecord:error:${err}`);
//   }
// };

// module.exports = {
//   getGeonameids,
//   getRecord,
//   saveRecord,
//   getAndSaveRecord
// };
