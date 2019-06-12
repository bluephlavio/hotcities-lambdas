const { expect } = require('chai');
const sinon = require('sinon');
const City = require('../../src/models/city');
const { getCities } = require('../data/data');

describe('city model', function() {
  describe('geonameids', function() {
    const cities = getCities();
    let geonameids;

    before(async function() {
      sinon.stub(City, 'find').returns(cities);
      geonameids = await City.geonameids();
    });

    it(`should return a list of ${cities.length} numbers`, async function() {
      expect(geonameids).to.be.an('array');
      expect(geonameids.length).to.be.equal(cities.length);
      geonameids.forEach(geonameid => {
        expect(geonameid).to.be.a('number');
      });
    });
  });
});
