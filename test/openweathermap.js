const { expect } = require('chai');
const { getCities } = require('./data');
const { getTemperatures } = require('../src/openweathermap');

describe('openweathermap', function() {
  describe('getTemperatures', function() {
    this.timeout(10000);

    const cities = getCities();
    const geonameids = cities.map(city => city.geonameid);

    let data = null;

    before(async function() {
      data = await getTemperatures(geonameids);
    });

    it('should work', function() {
      expect(data).to.be.ok;
    });

    it('should return a list', async function() {
      expect(data).to.be.an('array');
    });

    it('should have a proper data structure', function() {
      data.forEach(temperature => {
        expect(temperature).to.have.property('geonameid');
        expect(temperature).to.have.property('temp');
        expect(temperature).to.have.property('timestamp');
      });
    });
  });
});
