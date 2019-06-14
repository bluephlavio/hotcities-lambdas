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
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  photoid: {
    type: Number
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

TweetSchema.methods.getCity = async function() {
  const { geonameid } = this;
  return await City.findByGeonameid(geonameid);
};

TweetSchema.methods.getPhoto = async function() {
  const { photoid: id } = this;
  return id ? await Photo.findOne({ id }) : null;
};

TweetSchema.methods.tags = async function() {
  const commonTags = ['hotcitiesworld'];
  const city = await this.getCity();
  const { names, countryname } = city;
  return _.chain(commonTags)
    .concat(names)
    .concat(countryname)
    .value();
};

TweetSchema.methods.status = async function() {
  const { temp } = this;
  const city = await this.getCity();
  const { name, countrycode } = city;
  const tags = await this.tags();
  const tagsString = tags.map(tag => `#${tag}`).join(' ');
  const photo = await this.getPhoto();
  const { url } = photo;
  return `${temp}°C in ${name} ${countrycode} now! ${tagsString} ${url || ''}`.trim();
};

module.exports = mongoose.model('Tweet', TweetSchema);
