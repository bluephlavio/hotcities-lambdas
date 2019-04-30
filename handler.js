const { getAndSaveRecord } = require('./index');

exports.run = (event, context, callback) => {
  getAndSaveRecord()
    .then(record => {
      console.log(record);
    })
    .catch(err => {
      console.log(err);
    });
};
