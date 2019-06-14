const { expect } = require('chai');
const { getCities } = require('./data/factory');
const openweathermap = require('../src/openweathermap');

describe('openweathermap', function() {
  describe('getWeather', function() {
    this.timeout(10000);

    const cities = getCities();
    const geonameids = cities.map(city => city.geonameid);

    let data = null;

    before(async function() {
      data = await openweathermap.getWeather(geonameids);
    });

    it('should work', function() {
      expect(data).to.be.ok;
    });

    it('should return a list', async function() {
      expect(data).to.be.an('array');
    });

    it('should have a proper data structure', function() {
      data.forEach(entry => {
        expect(entry).to.have.property('geonameid');
        expect(entry).to.have.property('temp');
        expect(entry).to.have.property('timestamp');
      });
    });
  });
});
