require('dotenv').config();

const config = {
  mongo: {
    connection: process.env.MONGO_CONNECTION
  },
  openweathermap: {
    key: process.env.OPENWEATHERMAP_KEY
  },
  flickr: {
    key: process.env.FLICKR_KEY
  }
};

module.exports = config;
