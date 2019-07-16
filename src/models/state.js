const mongoose = require('mongoose');
const _ = require('lodash');
const City = require('./city');
const Record = require('./record');
const Photo = require('./photo');

PhotoSchema = new mongoose.Schema(
  {
    src: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const CurrentSchema = new mongoose.Schema(
  {
    geonameid: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    localname: {
      type: String,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    countryname: {
      type: String,
      required: true
    },
    countrycode: {
      type: String,
      required: true
    },
    population: {
      type: Number,
      required: true
    },
    temp: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    photos: [PhotoSchema],
    score: {
      type: Number,
      required: true
    },
    recordfrac: {
      type: Number,
      required: true
    },
    recordtemp: {
      type: Number,
      required: true
    },
    rank: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const RankingItemSchema = new mongoose.Schema(
  {
    geonameid: {
      type: Number
    },
    name: {
      type: String,
      required: true
    },
    localname: {
      type: String
    },
    lng: {
      type: Number,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    countryname: {
      type: String,
      required: true
    },
    countrycode: {
      type: String,
      required: true
    },
    population: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    recordfrac: {
      type: Number,
      required: true
    },
    recordtemp: {
      type: Number,
      required: true
    },
    rank: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const StatsSchema = new mongoose.Schema(
  {
    ranking: [RankingItemSchema],
    temprange: [Number]
  },
  {
    _id: false
  }
);

const StateSchema = new mongoose.Schema(
  {
    current: CurrentSchema,
    stats: StatsSchema
  },
  {
    capped: { max: 1 }
  }
);

StateSchema.statics.build = async function() {
  const record = await Record.current();
  const { geonameid } = record;
  const city = await City.findByGeonameid(geonameid);
  const photos = await Photo.findByGeonameid(geonameid, { limit: 3 });
  const ranking = await Record.ranking();
  const cityRank = _.chain(ranking)
    .find(entry => entry.geonameid === geonameid)
    .value();
  const temprange = await Record.tempRange();
  return await new this({
    current: _.omit(
      {
        ...record.toObject(),
        ...city.toObject(),
        photos: photos.map(photo => _.omit(photo, ['_id', '__v'])),
        ...cityRank
      },
      ['_id', '__v']
    ),
    stats: {
      ranking,
      temprange
    }
  });
};

StateSchema.statics.update = async function() {
  const state = await this.build();
  return state.save();
};

module.exports = mongoose.model('State', StateSchema);
