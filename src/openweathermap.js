const OpenWeatherMap = require('openweathermap-api-module');
const _ = require('lodash');
const config = require('./config');

const bbox = {
  lonLeft: '-180',
  latBottom: '-90',
  lonRight: '180',
  latTop: '90',
  zoom: '12'
};

const getWeather = async (cities) => {
  try {
    const client = new OpenWeatherMap(config.openweathermap.key);
    const geonameids = _.map(cities, city => city.geonameid);
    const res = await client.currentWeatherByCityIds({ cityIds: geonameids });
    const weather = res.list;
    return weather;
  } catch (err) {
    console.log(`getWeather:error:${err}`);
  }
};

module.exports = {
  getWeather
};
