const OpenWeatherMap = require('openweathermap-api-module');
const config = require('./config');

module.exports.getWeather = async (cities) => {
  try {
    const geonameids = cities.map(city => city.geonameid);
    const client = new OpenWeatherMap(config.openweathermap.key);
    return await client.currentWeatherByCityIds({ cityIds: geonameids });
  } catch (err) {
    console.log(`getWeather:error:${err}`);
  }
};
