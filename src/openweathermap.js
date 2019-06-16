const OpenWeatherMap = require('openweathermap-api-module');
const Weather = require('./models/weather');
const config = require('./config');

module.exports.MAX_CITIES_PER_CALL = 20;
module.exports.MAX_CALLS_PER_MINUTE = 60;

const openweathermap = new OpenWeatherMap(config.openweathermap.key);

module.exports.getWeather = async geonameids => {
  weather = [];
  for (const geonameid of geonameids) {
    try {
      const data = await openweathermap.currentWeatherByCityId({
        cityId: geonameid,
        units: 'metric'
      });
      const temp = data && data.main ? data.main.temp : null;
      if (!temp) {
        console.log(`No data found for ${geonameid}...`);
      }
      weather.push(
        new Weather({
          geonameid,
          temp
        })
      );
    } catch (err) {
      console.log(`Problem fetching data for ${geonameid}...`);
    }
  }
  return weather;
};
