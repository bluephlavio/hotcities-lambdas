const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/server');
const { getCities } = require('../data/factory');

chai.should();
chai.use(chaiHttp);

describe('GET /stats', function() {
  it('should get stats for all cities', function(done) {
    chai
      .request(app)
      .get('/stats')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an('array');
        res.body.pagination.should.be.ok;
        res.body.pagination.should.have.property('skip');
        res.body.pagination.should.have.property('limit');
        res.body.pagination.skip.should.be.eql(0);
        res.body.pagination.limit.should.be.eql(0);
        for (let i = 0; i < res.body.data.length; i++) {
          res.body.data[i].should.have.property('geonameid');
          res.body.data[i].should.have.property('recordfrac');
          res.body.data[i].should.have.property('recordtemp');
          res.body.data[i].should.have.property('score');
        }
      })
      .then(done)
      .catch(console.log);
  });

  it('should get stats for all cities with extras', function(done) {
    chai
      .request(app)
      .get('/stats?extra=name,countryname,countrycode')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an('array');
        res.body.pagination.should.be.ok;
        res.body.pagination.skip.should.be.eql(0);
        res.body.pagination.limit.should.be.eql(0);
        for (const entry of res.body.data) {
          entry.should.have.property('geonameid');
          entry.should.have.property('recordfrac');
          entry.should.have.property('recordtemp');
          entry.should.have.property('score');
          entry.should.have.property('name');
          entry.should.have.property('countryname');
          entry.should.have.property('countrycode');
        }
      })
      .then(done)
      .catch(console.log);
  });

  it('should paginate correctly', function(done) {
    chai
      .request(app)
      .get('/stats?limit=3&skip=1')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an('array');
        res.body.data.length.should.be.eql(3);
        res.body.pagination.should.be.ok;
        res.body.pagination.skip.should.be.eql(1);
        res.body.pagination.limit.should.be.eql(3);
      })
      .then(done)
      .catch(console.log);
  });

  it('should sort correctly by score', function(done) {
    chai
      .request(app)
      .get('/stats?sort=-score')
      .then(res => {
        res.should.have.status(200);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          res.body.data[i + 1].score.should.be.lte(res.body.data[i].score);
        }
      })
      .then(done)
      .catch(console.log);
  });
});

describe('GET /stats/:id', function() {
  const cities = getCities();
  for (const city of cities) {
    const { geonameid } = city;
    it('should return stats for correct city', function(done) {
      chai
        .request(app)
        .get(`/stats/${geonameid}`)
        .then(res => {
          if (res.statusCode === 200) {
            res.body.data.should.be.ok;
            res.body.data.should.have.property('geonameid');
            res.body.data.should.have.property('recordfrac');
            res.body.data.should.have.property('recordtemp');
            res.body.data.should.have.property('score');
          }
        })
        .then(done)
        .catch(console.log);
    });

    it('should return stats for correct city with extras', function(done) {
      chai
        .request(app)
        .get(`/stats/${geonameid}?extra=name,lat,lng`)
        .then(res => {
          if (res.statusCode === 200) {
            res.body.data.should.be.ok;
            res.body.data.should.have.property('geonameid');
            res.body.data.should.have.property('recordfrac');
            res.body.data.should.have.property('recordtemp');
            res.body.data.should.have.property('score');
            res.body.data.should.have.property('name');
            res.body.data.should.have.property('lat');
            res.body.data.should.have.property('lng');
          }
        })
        .then(done)
        .catch(console.log);
    });
  }
});
