const { expect } = require('chai');
const mongoose = require('mongoose');
const _ = require('lodash');
const { MAX_CITIES_PER_CALL } = require('../src/openweathermap');
const config = require('../src/config');
const {
  getAllGeonameids,
  getMissingDataGeonameids,
  getOldDataGeonameids,
  toBeFetchedGeonameids,
  cleanWeatherData
} = require('../src/helpers');
const { getCities, getWeatherData } = require('./data');

describe('helpers', function() {
  this.timeout(10000);

  before(async function() {
    await mongoose.connect(config.mongo.connection, {
      useNewUrlParser: true,
      useFindAndModify: false
    });
  });

  after(async function() {
    await mongoose.connection.close();
  });

  describe('getAllGeonameids', function() {
    it('should be a list', async function() {
      const geonameids = await getAllGeonameids();
      expect(geonameids).to.be.an('array');
    });

    it('should return some geonameids', async function() {
      const geonameids = await getAllGeonameids();
      const cities = getCities();
      cities.forEach(city => {
        const { geonameid } = city;
        expect(geonameids).to.contain(geonameid);
      });
    });
  });

  describe('getMissingDataGeonameids', function() {
    it('should be a list', async function() {
      const missing = await getMissingDataGeonameids();
      expect(missing).to.be.an('array');
    });
  });

  describe('getOldDataGeonameids', function() {
    it('should be a list', async function() {
      const old = await getOldDataGeonameids();
      expect(old).to.be.an('array');
    });
  });

  describe('toBeFetchedGeonameids', function() {
    it(`should be a list with ${MAX_CITIES_PER_CALL} entries`, async function() {
      const geonameids = await toBeFetchedGeonameids();
      expect(geonameids).to.be.an('array');
      expect(MAX_CITIES_PER_CALL).to.be.equal(geonameids.length);
    });
  });

  describe('cleanWeatherData', function() {
    let data = getWeatherData();
    let cleanedData = cleanWeatherData(data);

    it('should return a list with correct length', function() {
      expect(cleanedData).to.be.an('array');
      expect(data.list.length).to.be.equal(cleanedData.length);
    });

    it('should have proper data', function() {
      const sharjah = _.find(cleanedData, city => city.geonameid === 292672);
      expect(sharjah).to.have.property('temp');
      expect(50).to.be.equal(sharjah.temp);
    });
  });
});
