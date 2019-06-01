const mongoose = require('mongoose');
const { getAndSaveRecord } = require('./helpers');
const config = require('./config');

module.exports.fetcher = async () => {
  try {
    await mongoose.connect(config.mongo.connection);
    const record = await getAndSaveRecord();
    return record;
  } catch (err) {
    console.log(`fetcher:error:${err}`);
  }
};
