const { expect } = require("chai");
const sinon = require("sinon");
const _ = require("lodash");
const City = require("../src/models/city");
const Photo = require("../src/models/photo");
const twitter = require("../src/twitter");
const factory = require("./data/factory");

describe("twitter", function () {
  before(async function () {
    sinon.stub(City, "findOne").callsFake((query) => {
      const cities = factory.getCities();
      if (query) {
        const { geonameid } = query;
        return _.find(cities, (city) => city.geonameid == geonameid);
      }
      return cities;
    });
    sinon.stub(Photo, "findByGeonameid").callsFake((geonameid) => {
      const photos = factory.getPhotos();
      return _.filter(photos, (photo) => photo.geonameid == geonameid);
    });
  });

  after(async function () {
    City.findOne.restore();
    Photo.findByGeonameid.restore();
  });
  describe("createTweetFromRecord", function () {
    it("should return nice tweet objects", async function () {
      const records = factory.getRecords();
      for (const record of records) {
        const tweet = await twitter.createTweetFromRecord(record);
        expect(tweet.status).to.be.ok;
      }
    });
  });
});
