const mongoose = require("mongoose");
const config = require("./config");

module.exports.open = async () => {
  try {
    return await mongoose.connect(config.mongo.connection, {});
  } catch (err) {
    console.log(`open: ${err}`);
    throw err;
  }
};

module.exports.close = async () => {
  try {
    return await mongoose.connection.close();
  } catch (err) {
    console.log(`close: ${err}`);
    throw err;
  }
};
