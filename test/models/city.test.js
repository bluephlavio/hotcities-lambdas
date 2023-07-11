const { expect } = require("chai");
const sinon = require("sinon");
const City = require("../../src/models/city");
const { getCities } = require("../data/factory");

describe("City model", function () {
  const cities = getCities();

  before(function () {
    sinon.stub(City, "find").returns(cities);
  });

  after(function () {
    City.find.restore();
  });

  describe("geonameids", function () {
    let geonameids;

    before(async function () {
      geonameids = await City.geonameids();
    });

    it(`should return a list of ${cities.length} numbers`, function () {
      expect(geonameids).to.be.an("array");
      expect(geonameids.length).to.be.equal(cities.length);
      geonameids.forEach((geonameid) => {
        expect(geonameid).to.be.a("number");
      });
    });
  });
});
