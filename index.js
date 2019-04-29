require("dotenv").config();

const _ = require("lodash");
const { getWeather } = require("./openweathermap");
const { db } = require("./firebase");

const getCities = () => {
  return db
    .collection("cities")
    .get()
    .then(snapshot => {
      const cities = [];
      snapshot.forEach(doc => {
        const city = doc.data();
        cities.push(city);
      });
      return cities;
    });
};

const getRecord = async () => {
  const weather = await getWeather();
  const cities = await getCities();
  const geonameids = _.map(cities, city => parseInt(city.geonameid));
  const availables = _.filter(weather, entry =>
    _.includes(geonameids, parseInt(entry.id))
  );
  const temperatures = _.map(availables, entry => entry.main.temp);
  const maxTemp = _.max(temperatures);
  const candidates = _.filter(availables, entry => entry.main.temp === maxTemp);
  return candidates[Math.floor(Math.random() * candidates.length)];
};

module.exports = {
  getCities,
  getRecord
};
