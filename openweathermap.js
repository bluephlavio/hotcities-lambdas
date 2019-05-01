const OpenWeatherMap = require('openweathermap-api-module');
const config = require('./config');

const bbox = {
  lonLeft: '-180',
  latBottom: '-90',
  lonRight: '180',
  latTop: '90',
  zoom: '12'
};

const getWeather = async () => {
  try {
    const client = new OpenWeatherMap(config.openweathermap.key);
    const res = await client.currentWeatherByRectangleZone({ bbox });
    const weather = res.list;
    return weather;
  } catch (err) {
    console.log(`getWeather:error:${err}`);
  }
};

module.exports = {
  getWeather
};
