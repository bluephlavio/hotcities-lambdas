const mongoose = require('mongoose');
const config = require('./config');

const openDb = async () => {
  try {
    return await mongoose.connect(config.mongo.connection, {
      useNewUrlParser: true,
      useFindAndModify: false
    });
  } catch (err) {
    console.log(`openDb: ${err}`);
    throw err;
  }
};

const closeDb = async () => {
  try {
    return await mongoose.connection.close();
  } catch (err) {
    console.log(`closeDb: ${err}`);
    throw err;
  }
};

module.exports = {
  openDb,
  closeDb
};
