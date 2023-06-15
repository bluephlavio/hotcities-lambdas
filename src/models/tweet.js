const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  photourl: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

TweetSchema.statics.last = async function () {
  return await this.findOne().sort({ timestamp: 'desc' });
};

TweetSchema.methods.tweetable = async function () {
  // const last = await this.model('Tweet').last();
  // if (!last) {
  //   return true;
  // }
  // const { geonameid, temp, timestamp } = last;
  // if (this.timestamp > timestamp) {
  //   if (this.geonameid == geonameid) {
  //     return this.temp > temp;
  //   }
  //   return true;
  // }
  // return false;
  return true;
};

module.exports = mongoose.model('Tweet', TweetSchema);
