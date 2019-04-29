const config = {
  firebase: {
    keys: process.env.GOOGLE_APPLICATION_CREDENTIALS
  },
  openweathermap: {
    key: process.env.OPENWEATHERMAP_KEY
  }
};

module.exports = config;
