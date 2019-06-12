const { expect } = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const City = require('../../src/models/city');
const Weather = require('../../src/models/weather');
const { getWeather, getCities } = require('../data/factory');

describe('Weather model', function() {
  const cities = getCities();
  const weather = getWeather();

  before(async function() {
    sinon.stub(City, 'find').returns(cities);
  });

  describe('temperatures', function() {
    let temperatures;

    before(async function() {
      sinon.stub(Weather, 'find').returns(weather);
      temperatures = await Weather.temperatures();
    });

    after(async function() {
      Weather.find.restore();
    });

    it(`should return a list with ${weather.length} numbers`, function() {
      expect(temperatures).to.be.an('array');
      expect(temperatures.length).to.be.equal(weather.length);
      temperatures.forEach(temperature => {
        expect(temperature).to.be.a('number');
      });
    });
  });

  describe('missingDataGeonameids', function() {
    const weather1 = _.slice(weather, 0, 1);
    const weather2 = _.slice(weather, 0, 2);
    const weather3 = _.slice(weather, 0, 3);

    let missingDataGeonameids1;
    let missingDataGeonameids2;
    let missingDataGeonameids3;

    before(async function() {
      sinon.stub(Weather, 'find').returns(weather1);
      missingDataGeonameids1 = await Weather.missingDataGeonameids();
      Weather.find.restore();

      sinon.stub(Weather, 'find').returns(weather2);
      missingDataGeonameids2 = await Weather.missingDataGeonameids();
      Weather.find.restore();

      sinon.stub(Weather, 'find').returns(weather3);
      missingDataGeonameids3 = await Weather.missingDataGeonameids();
      Weather.find.restore();
    });

    it('should return a list with correct number of elements', function() {
      expect(missingDataGeonameids1).to.be.an('array');
      expect(missingDataGeonameids1.length).to.be.equal(cities.length - weather1.length);

      expect(missingDataGeonameids2).to.be.an('array');
      expect(missingDataGeonameids2.length).to.be.equal(cities.length - weather2.length);

      expect(missingDataGeonameids3).to.be.an('array');
      expect(missingDataGeonameids3.length).to.be.equal(cities.length - weather3.length);
    });
  });
});
