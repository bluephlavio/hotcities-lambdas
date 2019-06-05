const OpenWeatherMap = require('openweathermap-api-module');
const config = require('./config');

module.exports.MAX_CITIES_PER_CALL = 20;
module.exports.MAX_CALLS_PER_MINUTE = 50;

module.exports.getTemperatures = async geonameids => {
  try {
    const client = new OpenWeatherMap(config.openweathermap.key);
    const temperatures = [];
    for (geonameid of geonameids) {
      const data = await client.currentWeatherByCityId({ cityId: geonameid, units: 'metric' });
      temperatures.push({
        geonameid,
        temp: data && data.main ? data.main.temp : null,
        timestamp: new Date()
      });
    }
    return temperatures;
  } catch (err) {
    console.log(`getTemperatures: ${err}`);
  }
};
