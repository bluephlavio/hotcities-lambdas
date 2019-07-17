const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  geonameid: {
    type: Number,
    required: true
  },
  src: {
    type: String,
    required: true
  },
  url: {
    type: String
  },
  title: {
    type: String
  },
  owner: {
    name: {
      type: String
    },
    url: {
      type: String
    }
  },
  license: {
    name: {
      type: String
    },
    url: {
      type: String
    }
  }
});

PhotoSchema.statics.findByGeonameid = async function(geonameid, opts) {
  return await this.find({ geonameid }).limit(opts ? opts.limit || 0 : 0);
};

module.exports = mongoose.model('Photo', PhotoSchema);
