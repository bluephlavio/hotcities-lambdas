const { expect } = require('chai');
const { getCities } = require('./data');
const { getWeather } = require('../src/openweathermap');

describe('openweathermap', function() {
  describe('getWeather', function() {
    this.timeout(10000);

    let cities = getCities();
    let data = null;

    before(async function() {
      const geonameids = cities.map(city => city.geonameid);
      data = await getWeather(geonameids);
    });

    it('should work', function() {
      expect(data).to.be.ok;
    });

    it('should return a list', async function() {
      expect(data).to.have.property('list');
      expect(data.list).to.be.an('array');
      expect(data.list.length).to.be.equal(cities.length);
      expect(data.cnt).to.be.equal(cities.length);
    });

    it('should have a proper data structure', function() {
      expect(data).to.have.property('cnt');
      data.list.forEach(city => {
        expect(city).to.have.property('id');
        expect(city).to.have.nested.property('main.temp');
      });
    });
  });
});
