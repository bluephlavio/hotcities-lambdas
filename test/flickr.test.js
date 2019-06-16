const { expect } = require('chai');
const flickr = require('../src/flickr');
const { getCities } = require('./data/factory');

describe('flickr', function() {
  describe('searchPhotos', function() {
    const cities = getCities();
    it('should return a list', async function() {
      for (const city of cities) {
        const photos = await flickr.searchPhotos(city, { limit: 2 });
        expect(photos).to.be.an('array');
      }
    });

    it('all elements in the list must have expected fields', async function() {
      for (const city of cities) {
        const photos = await flickr.searchPhotos(city, { limit: 2 });
        photos.forEach(photo => {
          expect(photo).to.have.property('geonameid');
          expect(photo).to.have.property('url');
          expect(photo).to.have.property('title');
          expect(photo).to.have.nested.property('license.name');
          expect(photo).to.have.nested.property('license.url');
          expect(photo).to.have.nested.property('owner.name');
          expect(photo).to.have.nested.property('owner.url');
          expect(photo.geonameid).to.be.a('number');
          expect(photo.url).to.be.a('string');
          expect(photo.title).to.be.a('string');
          expect(photo.license.name).to.be.a('string');
          expect(photo.license.url).to.be.a('string');
          expect(photo.owner.name).to.be.a('string');
          expect(photo.owner.url).to.be.a('string');
        });
      }
    });
  });
});
