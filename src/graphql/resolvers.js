const { GraphQLScalarType, Kind } = require("graphql");
const City = require("../models/city");
const Record = require("../models/record");
const State = require("../models/state");

const resolvers = {
  Query: {
    cities: async () => {
      return await City.find();
    },
    city: async (_, { geonameid }) => {
      return await City.findByGeonameid(geonameid);
    },
    records: async (_, { limit, match, sort, startDate, endDate, period }) => {
      const matchObj = match ? JSON.parse(match) : {};
      if (startDate && endDate) {
        matchObj.timestamp = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
      const groupBy = {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        week: { $dateToString: { format: "%Y-%U", date: "$timestamp" } },
        month: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
      };
      const result = await Record.aggregate([
        {
          $match: matchObj,
        },
        {
          $group: {
            _id: period ? groupBy[period] : { timestamp: "$timestamp" },
            record: {
              $max: {
                temp: "$temp",
                timestamp: "$timestamp",
                geonameid: "$geonameid",
              },
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: "$record",
          },
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
          $limit: limit,
        },
      ]);
      return result;
    },
    currentRecord: async () => {
      const results = await Record.aggregate([
        {
          $sort: { timestamp: -1 },
        },
        {
          $limit: 1,
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
      ]);
      return results[0];
    },
    state: async () => {
      const result = await State.findOne();
      return result;
    },
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue: (value) => {
      return new Date(value);
    },
    serialize: (value) => {
      return value.toISOString();
    },
    parseLiteral: (ast) => {
      if (ast.kind === Kind.STRING) {
        return new Date(ast.value);
      }
      return null;
    },
  }),

  City: {},

  Record: {},
};

module.exports = resolvers;
