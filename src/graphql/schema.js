const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require("./resolvers");

const typeDefs = `
  type Query {
    cities: [City]
    city(geonameid: Int): City
    records(limit: Int, match: String, sort: String): [Record]
  }

  type City {
    _id: ID!
    geonameid: Int!
    name: String!
    countrycode: String!
    population: Int!
    lat: Float!
    lng: Float!
    timezone: String!
    countryname: String!
    lang: String!
    localname: String
  }

  type Record {
    _id: ID!,
    city: City!
    temp: Float!
    timestamp: String!
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
