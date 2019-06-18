const openweathermap = require('./openweathermap');
const flickr = require('./flickr');
const twitter = require('./twitter');
const db = require('./db');
const City = require('./models/city');
const Weather = require('./models/weather');
const Record = require('./models/record');
const Photo = require('./models/photo');

module.exports.fetcher = async () => {
  try {
    await db.open();
    console.log('Connected to db.');
    const geonameids = await Weather.queue(openweathermap.MAX_CALLS_PER_MINUTE);
    console.log(`${geonameids.length} geonameids selected for weather data fetching.`);
    const weather = await openweathermap.getWeather(geonameids);
    console.log(`${weather.length} weather data fetched from openweathermap.`);
    for (const entry of weather) {
      await Weather.register(entry);
    }
    console.log('Weather data saved to db.');
    await db.close();
    console.log('Db connection closed.');
  } catch (err) {
    console.log(`fetcher: ${err}`);
  }
};

module.exports.recorder = async () => {
  try {
    await db.open();
    console.log('Connected to db.');
    const ready = await Weather.ready();
    console.log(`Weather data${ready ? ' ' : ' not already '}fetched for all cities.`);
    if (ready) {
      const record = await Weather.record();
      const { geonameid, temp } = record;
      const city = await City.findByGeonameid(geonameid);
      const { name } = city;
      console.log(`Record found: ${temp} °C in ${name}!`);
      await record.save();
      console.log('Record saved to db.');
      const photos = await flickr.searchPhotos(city, 3);
      console.log(`${photos.length} photos fetched for ${name}.`);
      for (const photo of photos) {
        const { id } = photo;
        await Photo.findOneAndUpdate({ id }, photo, { upsert: true });
      }
      console.log('Fetched photos saved to db.');
    }
    await db.close();
    console.log('Db connection closed.');
  } catch (err) {
    console.log(`recorder: ${err}`);
  }
};

module.exports.twitterbot = async () => {
  try {
    await db.open();
    console.log('Connected to db.');
    const record = await Record.current();
    const { geonameid, temp } = record;
    const city = await City.findByGeonameid(geonameid);
    const { name } = city;
    console.log(`Current record: ${temp}°C in ${name}.`);
    const tweet = await twitter.createTweetFromRecord(record);
    const tweetable = await tweet.tweetable();
    if (tweetable) {
      console.log('Status is updatable...');
      const { status } = tweet;
      console.log(`Ready to post: ${status}...`);
      await twitter.post(tweet);
      console.log('Status posted.');
      await tweet.save();
      console.log('Tweet saved to db.');
    } else {
      console.log('Status must not be updated.');
    }
    await db.close();
    console.log('Db connection closed.');
  } catch (err) {
    console.log(`twitterbot: ${err}`);
  }
};
