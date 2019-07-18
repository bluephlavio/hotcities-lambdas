const Twit = require('twit');
const _ = require('lodash');
const emoji = require('node-emoji');
const City = require('./models/city');
const Photo = require('./models/photo');
const Tweet = require('./models/tweet');
const { formatTemp } = require('./helpers/formatters');
const config = require('./config');

const twitter = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

const commonTags = ['hotcitiesworld', 'hotweather', 'sunny'];

const taggify = tag => `#${tag.toLowerCase().replace(/(\s|\')/g, '')}`;

module.exports.createTweetFromRecord = async function(record) {
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
  const { url: photourl } = photo;
  const status = emoji.emojify(
    `${name} (${countrycode}), with ${formatTemp(
      temp
    )}, is the hottest city in the world now :fire::sparkles:! ${tags} :sunny::palm_tree`
  );
  return new Tweet({
    geonameid,
    temp,
    photourl,
    status
  });
};

module.exports.post = async tweet => {
  const { status } = tweet;
  return await twitter.post('statuses/update', { status });
};
