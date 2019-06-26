const db = require('./db');
const City = require('./models/city');
const Record = require('./models/record');
const twitter = require('./twitter');

module.exports.handler = async () => {
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
