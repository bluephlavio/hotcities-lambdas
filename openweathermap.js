const OpenWeatherMap = require("openweathermap-api-module");
const config = require("./config");

const getWeather = () => {
  const client = new OpenWeatherMap(config.openweathermap.key);
  return client
    .currentWeatherByRectangleZone({
      bbox: {
        lonLeft: "-180",
        latBottom: "-90",
        lonRight: "180",
        latTop: "90",
        zoom: "12"
      }
    })
    .then(res => {
      return res.list;
    });
};

module.exports = {
  getWeather
};
