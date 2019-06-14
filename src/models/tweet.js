const mongoose = require('mongoose');

const TweetSchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  photoid: {
    type: Number,
    required: true
  }
});

TweetSchema.statics.last = async function() {
  return await this.find()
    .sort({ timestamp: 'desc' })
    .limit(1);
};

TweetSchema.methods.tweetable = async function() {
  const last = await this.model('Tweet').last();
  const { geonameid, temp } = last;
  if (this.geonameid == geonameid) {
    return this.temp > temp;
  }
  return true;
};

module.exports = mongoose.model('Tweet', TweetSchema);
