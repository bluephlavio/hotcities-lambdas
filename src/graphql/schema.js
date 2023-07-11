const { makeExecutableSchema } = require("@graphql-tools/schema");
const resolvers = require("./resolvers");

const typeDefs = `
  scalar Date
  
  type Query {
    cities: [City]
    city(geonameid: Int): City
    records(
      limit: Int = 1000000,
      match: String = null,
      sort: String = "{ \\"timestamp\\": -1 }",
      startDate: Date = null,
      endDate: Date = null,
      period: String = null
    ): [Record]
    currentRecord: Record
    state: State
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
    _id: ID!
    city: City!
    temp: Float!
    timestamp: Date!
  }

  type Current {
    _id: ID!
    geonameid: Int!
    name: String!
    localname: String!
    lng: Float!
    lat: Float!
    countryname: String!
    countrycode: String!
    population: Int!
    temp: Float!
    timestamp: Date!
    score: Float!
    recordfrac: Float!
    recordtemp: Float!
    rank: Int!
  }

  type RankingItem {
    _id: ID!
    geonameid: Int!
    name: String!
    localname: String!
    lng: Float!
    lat: Float!
    countryname: String!
    countrycode: String!
    population: Float!
    score: Float!
    recordfrac: Float!
    recordtemp: Float!
    rank: Int!
  }

  type Stats {
    ranking: [RankingItem]
    temprange: [Float]
  }

  type State {
    _id: ID!
    current: Current
    stats: Stats
  }
`;

module.exports = makeExecutableSchema({ typeDefs, resolvers });
