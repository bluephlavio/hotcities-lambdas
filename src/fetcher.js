const openweathermap = require("./openweathermap");
const db = require("./db");
const Weather = require("./models/weather");

module.exports.handler = async () => {
  try {
    await db.open();
    console.log("Connected to db.");
    const geonameids = await Weather.queue(openweathermap.MAX_CALLS_PER_MINUTE);
    console.log(
      `${geonameids.length} geonameids selected for weather data fetching.`
    );
    const weather = await openweathermap.getWeather(geonameids);
    console.log(`${weather.length} weather data fetched from openweathermap.`);
    for (const entry of weather) {
      await Weather.register(entry);
    }
    console.log("Weather data saved to db.");
    await db.close();
    console.log("Db connection closed.");
  } catch (err) {
    console.log(`fetcher: ${err}`);
  }
};
