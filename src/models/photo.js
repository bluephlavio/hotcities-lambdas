const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  id: {
    type: Number,
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
    id: {
      type: String
    },
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

PhotoSchema.statics.findByGeonameid = async function(geonameid) {
  return await this.find({ geonameid });
};

module.exports = mongoose.model('Photo', PhotoSchema);
