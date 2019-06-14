const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  geonameid: {
    type: Number,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  license: {
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
  owner: {
    name: {
      type: String
    },
    url: {
      type: String
    }
  }
});

PhotoSchema.statics.findByGeonameid = async function(geonameid) {
  return await this.find({ geonameid });
};

module.exports = PhotoSchema.model('Photo', PhotoSchema);
