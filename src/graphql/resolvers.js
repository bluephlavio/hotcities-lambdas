const City = require("../models/city");
const Record = require("../models/record");

const resolvers = {
  Query: {
    cities: async () => {
      return await City.find();
    },
    city: async (_, { geonameid }) => {
      return await City.findByGeonameid(geonameid);
    },
    records: async (_, { limit, match, sort }) => {
      return await Record.aggregate([
        {
          $match: match ? JSON.parse(match) : {},
        },
        {
          $lookup: {
            from: "cities",
            localField: "geonameid",
            foreignField: "geonameid",
            as: "city",
          },
        },
        {
          $unwind: "$city",
        },
        {
          $sort: sort ? JSON.parse(sort) : {},
        },
        {
          $limit: limit || 0,
        },
      ]);
    },
  },

  City: {},

  Record: {},
};

module.exports = resolvers;
