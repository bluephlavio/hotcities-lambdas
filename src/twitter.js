const Twit = require('twit');
const config = require('./config');

const twitter = new Twit({
  consumer_key: config.twitter.consumerKey,
  consumer_secret: config.twitter.consumerSecret,
  access_token: config.twitter.accessToken,
  access_token_secret: config.twitter.accessTokenSecret
});

const post = async status => {
  return await twitter.post('statuses/update', { status });
};

module.exports = {
  post
};
