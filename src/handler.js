const { getWeather, MAX_CALLS_PER_MINUTE } = require('./openweathermap');
const { searchPhotos } = require('./flickr');
const { post } = require('./twitter');
const { openDb, closeDb } = require('./db');
const City = require('./models/City');
const Weather = require('./models/weather');
const Record = require('./models/record');
const Photo = require('./models/photo');
const Tweet = require('./models/tweet');

module.exports.fetcher = async () => {
  try {
    await openDb();
    console.log('Connected to db.');
    const geonameids = await Weather.queue(MAX_CALLS_PER_MINUTE);
    console.log(`${geonameids.length} geonameids selected for weather data fetching.`);
    const weather = await getWeather(geonameids);
    console.log(`${temperatures.length} weather data fetched from openweathermap.`);
    for (const entry of weather) {
      await new Weather(entry).save();
    }
    console.log('Weather data saved to db.');
    await closeDb();
    console.log('Db connection closed.');
  } catch (err) {
    console.log(`fetcher: ${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await openDb();
    console.log('Connected to db.');
    const ready = await Weather.ready();
    console.log(`Weather data ${ready ? '' : 'not'} fetched for all cities.`);
    if (ready) {
      const record = await Weather.record();
      const { geonameid, temp } = record;
      const city = await City.findByGeonameid(geonameid);
      const { name } = city;
      console.log(`Record found: ${temp} °C in ${name}!`);
      await new Record({
        geonameid,
        temp
      }).save();
      console.log('Record saved to db.');
    }
    await closeDb();
  } catch (err) {
    console.log(`recorder: ${err}`);
  }
};
