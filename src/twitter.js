const { TwitterApi } = require('twitter-api-v2');
const _ = require('lodash');
const emoji = require('node-emoji');
const City = require('./models/city');
const Photo = require('./models/photo');
const Tweet = require('./models/tweet');
const { formatTemp } = require('./helpers/formatters');
const config = require('./config');

const twitterClient = new TwitterApi({
  appKey: config.twitter.consumerKey,
  appSecret: config.twitter.consumerSecret,
  accessToken: config.twitter.accessToken,
  accessSecret: config.twitter.accessTokenSecret,
});

const commonTags = [
  'hotcitiesworld',
  'worldcities',
  'globalcities',
  'hotweather',
  'heatwave',
  'sunny',
];

const taggify = (tag) => `#${tag.toLowerCase().replace(/(\s|\')/g, '')}`;

module.exports.createTweetFromRecord = async function (record) {
  const { geonameid, temp } = record;
  const city = await City.findByGeonameid(geonameid);
  const { name, countrycode, countryname } = city;
  const tags = _.chain(commonTags)
    .concat(name)
    .concat(countryname)
    .map(taggify)
    .value()
    .join(' ');
  const photos = await Photo.findByGeonameid(geonameid);
  const photo = _.sample(photos);
  const photourl = photo ? photo.url : null;
  const status = emoji.emojify(
    `:fire: ${formatTemp(
      temp
    )} in ${name} (${countrycode}): hottest city in the world right now! :sparkles: ${tags} :sunny::palm_tree:`
  );
  return new Tweet({
    geonameid,
    temp,
    photourl,
    status,
  });
};

module.exports.post = async (tweet) => {
  const { status } = tweet;
  try {
    return await twitterClient.v2.tweet(status);
  } catch (err) {
    console.log(`twitter.post: ${err}`);
  }
};
