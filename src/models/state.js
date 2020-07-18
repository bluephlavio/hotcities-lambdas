const mongoose = require('mongoose');
const _ = require('lodash');
const Record = require('./record');
const Photo = require('./photo');

const PhotoSchema = new mongoose.Schema(
  {
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

const StateSchema = new mongoose.Schema({
  current: CurrentSchema,
  stats: StatsSchema
});

StateSchema.statics.build = async function() {
  const record = await Record.current();
  console.log(`state.build.record: ${record}`);
  const { geonameid } = record;
  const photos = await Photo.findByGeonameid(geonameid, { limit: 3 });
  const ranking = await Record.ranking();
  console.log(`state.build.ranking: ${ranking}`);
  const cityRank = _.chain(ranking)
    .find(entry => entry.geonameid === geonameid)
    .value();
  const temprange = await Record.tempRange();
  console.log(`state.build.temprange: ${temprange}`);
  const newState = await new this({
    current: _.omit(
      {
        ...cityRank,
        temp: record.temp,
        timestamp: record.timestamp,
        photos: photos.map(photo => _.omit(photo, ['_id', '__v']))
      },
      ['_id', '__v']
    ),
    stats: {
      ranking,
      temprange
    }
  });
  console.log(`state.build.newState: ${newState}`);
  return newState;
};

StateSchema.statics.update = async function() {
  const newState = await this.build();
  const oldState = await this.findOne();
  await newState.save();
  if (oldState) await oldState.remove();
  return newState;
};

module.exports = mongoose.model('State', StateSchema);
