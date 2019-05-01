const { getAndSaveRecord } = require('./index');

module.exports.fetcher = async () => {
  try {
    const record = await getAndSaveRecord();
    return record;
  } catch (err) {
    console.log(`fetcher:error:${err}`);
  }
};
