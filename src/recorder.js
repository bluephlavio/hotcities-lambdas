const db = require('./db');
const City = require('./models/city');
const Weather = require('./models/weather');
const Photo = require('./models/photo');
const flickr = require('./flickr');

module.exports.handler = async () => {
  try {
    await db.open();
    console.log('Connected to db.');
    const ready = await Weather.ready();
    console.log(
      `Weather data${ready ? ' ' : ' not already '}fetched for all cities.`
    );
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
