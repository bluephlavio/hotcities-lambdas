const OpenWeatherMap = require('openweathermap-api-module');
const config = require('./config');

module.exports.MAX_CITIES_PER_CALL = 20;

module.exports.getWeather = async geonameids => {
  try {
    const client = new OpenWeatherMap(config.openweathermap.key);
    return await client.currentWeatherByCityIds({ cityIds: geonameids });
  } catch (err) {
    console.log(`getWeather:error:${err}`);
  }
};
