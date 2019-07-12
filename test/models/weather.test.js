const { expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const City = require('../../src/models/city');
const Weather = require('../../src/models/weather');
const { getWeather, getCities } = require('../data/factory');

describe('Weather model', function() {
  const cities = getCities();
  const weather = getWeather();
  const variant1 = _.slice(weather, 0, 1);
  const variant2 = _.slice(weather, 0, 2);
  const variant3 = _.slice(weather, 0, 3);
  const variants = [variant1, variant2, variant3];
  const maxTemp = _.max(weather.map(entry => entry.temp));
  const hottests = _.filter(weather, entry => entry.temp == maxTemp);

  before(async function() {
    sinon.stub(City, 'find').returns(cities);
  });

  describe('temperatures', function() {
    before(async function() {
      sinon.stub(Weather, 'find').returns(weather);
    });

    after(async function() {
      Weather.find.restore();
    });

    it(`should return a list with ${weather.length} numbers`, async function() {
      const temperatures = await Weather.temperatures();
      expect(temperatures).to.be.an('array');
      expect(temperatures.length).to.be.equal(weather.length);
      temperatures.forEach(temperature => {
        expect(temperature).to.be.a('number');
      });
    });
  });

  describe('missingDataGeonameids', function() {
    before(function() {
      const fakeWeather = sinon.stub(Weather, 'find');
      variants.forEach((variant, i) => fakeWeather.onCall(i).returns(variant));
    });

    after(function() {
      Weather.find.restore();
    });

    it('should return a list with correct number of elements', async function() {
      for (const variant of variants) {
        const missingDataGeonameids = await Weather.missingDataGeonameids();
        expect(missingDataGeonameids).to.be.an('array');
        expect(missingDataGeonameids.length).to.be.equal(
          cities.length - variant.length
        );
      }
    });
  });

  describe('withOlderDataGeonameids', function() {
    beforeEach(function() {
      const fakeWeather = sinon.stub(Weather, 'find');
      variants.forEach((variant, i) => fakeWeather.onCall(i).returns(variant));
    });

    afterEach(function() {
      Weather.find.restore();
    });

    it('should return a list with correct number of elements', async function() {
      const older = await Weather.withOlderDataGeonameids(1);
      expect(older).to.be.an('array');
      expect(older.length).to.be.equal(1);
    });

    it('should return the correct geonameids', async function() {
      for (const variant of variants) {
        const expected = _.chain(variant)
          .sortBy('timestamp')
          .map(entry => entry.geonameid)
          .value();
        const older = await Weather.withOlderDataGeonameids(2);
        older.forEach((geonameid, i) => {
          expect(expected[i]).to.be.equal(geonameid);
        });
      }
    });
  });

  describe('record', function() {
    before(async function() {
      sinon.stub(Weather, 'find').callsFake(function(query) {
        if (query && query.temp == maxTemp) {
          return hottests;
        }
        return weather;
      });
    });

    after(function() {
      Weather.find.restore();
    });

    it('should return the correct structure', async function() {
      const record = await Weather.record();
      expect(record).to.be.ok;
      expect(record).to.have.property('geonameid');
      expect(record).to.have.property('temp');
      expect(record).to.have.property('timestamp');
    });

    it('should return the correct data', async function() {
      const record = await Weather.record();
      const { temp } = record;
      expect(temp).to.be.equal(maxTemp);
    });
  });
});
