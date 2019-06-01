const config = {
  openweathermap: {
    key: process.env.OPENWEATHERMAP_KEY
  },
  mongo: {
    connection: process.env.MONGO_CONNECTION
  }
};

module.exports = config;
