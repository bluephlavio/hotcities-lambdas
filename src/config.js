require("dotenv").config();

const config = {
  mongo: {
    connection: process.env.MONGO_CONNECTION,
  },
  openweathermap: {
    key: process.env.OPENWEATHERMAP_KEY,
  },
  flickr: {
    key: process.env.FLICKR_KEY,
  },
  twitter: {
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  },
};

module.exports = config;
