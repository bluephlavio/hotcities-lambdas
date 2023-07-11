const chai = require("chai");
const chaiHttp = require("chai-http");
const { app } = require("../../src/server");
const { getCities } = require("../data/factory");

chai.should();
chai.use(chaiHttp);

describe("GET /cities", function () {
  it("should get all cities", function (done) {
    chai
      .request(app)
      .get("/cities")
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an("array");
        res.body.pagination.should.be.ok;
        res.body.pagination.skip.should.be.eql(0);
        res.body.pagination.limit.should.be.eql(0);
      })
      .then(done)
      .catch(console.log);
  });

  it("should paginate correctly", function (done) {
    chai
      .request(app)
      .get("/cities?limit=3&skip=1")
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an("array");
        res.body.data.length.should.be.eql(3);
        res.body.pagination.should.be.ok;
        res.body.pagination.skip.should.be.eql(1);
        res.body.pagination.limit.should.be.eql(3);
      })
      .then(done)
      .catch(console.log);
  });

  it("should sort correctly by population", function (done) {
    chai
      .request(app)
      .get("/cities?limit=10&sort=-population")
      .then((res) => {
        res.should.have.status(200);
        res.body.data.length.should.be.eql(10);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          res.body.data[i + 1].population.should.be.lt(
            res.body.data[i].population
          );
        }
      })
      .then(done)
      .catch(console.log);
  });

  it("should filter correctly by population", function (done) {
    chai
      .request(app)
      .get("/cities?population=>10000000")
      .then((res) => {
        res.should.have.status(200);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          res.body.data[i].population.should.be.gt(10000000);
        }
      })
      .then(done)
      .catch(console.log);
  });

  it("should filter correctly by name", function (done) {
    chai
      .request(app)
      .get("/cities?name=Sharjah")
      .then((res) => {
        res.should.have.status(200);
        res.body.data.should.be.an("array");
        res.body.data.should.have.lengthOf(1);
        res.body.data[0].name.should.be.eql("Sharjah");
      })
      .then(done)
      .catch(console.log);
  });
});

describe("GET /cities/:id", function () {
  const cities = getCities();
  for (const city of cities) {
    const { name, geonameid } = city;
    it("should return correct city", function (done) {
      chai
        .request(app)
        .get(`/cities/${geonameid}`)
        .then((res) => {
          res.should.have.status(200);
          res.body.data.should.be.ok;
          res.body.data.should.have.property("geonameid");
          res.body.data.should.have.property("name");
          res.body.data.should.have.property("localname");
          res.body.data.should.have.property("countryname");
          res.body.data.should.have.property("countrycode");
          res.body.data.should.have.property("timezone");
          res.body.data.should.have.property("lat");
          res.body.data.should.have.property("lng");
          res.body.data.should.have.property("lang");
          res.body.data.should.have.property("population");
          res.body.data.name.should.be.eql(name);
        })
        .then(done)
        .catch(console.log);
    });
  }
});
