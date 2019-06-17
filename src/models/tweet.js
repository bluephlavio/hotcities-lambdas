const mongoose = require('mongoose');
const _ = require('lodash');
const City = require('./city');
const Photo = require('./photo');

const TweetSchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true
  },
  temp: {
    type: Number,
    required: true
  },
  photourl: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

TweetSchema.statics.createFromRecord = async function(record) {
  const { geonameid, temp } = record;
  const city = await City.findByGeonameid(geonameid);
  const { name, names, countrycode, countryname } = city;
  const tags = _.chain(['hotcitiesworld'])
    .concat(names ? names : [])
    .concat(countryname)
    .map(tag => `#${tag.toLowerCase().replace(/(\s|\')/g, '')}`)
    .value()
    .join(' ');
  const photos = await Photo.findByGeonameid(geonameid);
  const photo = _.sample(photos);
  const photourl = `http://www.flickr.com/photos/${photo.owner.id}/${photo.id}`;
  const status = `${temp} °C in ${name} (${countrycode}) now! ${tags} ${photourl}`;
  return new this({
    geonameid,
    temp,
    photourl,
    status
  });
};

TweetSchema.statics.last = async function() {
  return await this.findOne().sort({ timestamp: 'desc' });
};

TweetSchema.methods.tweetable = async function() {
  const last = await this.model('Tweet').last();
  if (!last) {
    return true;
  }
  const { geonameid, temp, timestamp } = last;
  if (this.timestamp > timestamp) {
    if (this.geonameid == geonameid) {
      return this.temp > temp;
    }
    return true;
  }
  return false;
};

module.exports = mongoose.model('Tweet', TweetSchema);
