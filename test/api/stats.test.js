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
        res.body.data.should.have.property('ranking');
        res.body.data.ranking.should.be.an('array');
        for (let i = 0; i < res.body.data.ranking.length; i++) {
          res.body.data.ranking[i].should.have.property('geonameid');
          res.body.data.ranking[i].should.have.property('recordfrac');
          res.body.data.ranking[i].should.have.property('recordtemp');
          res.body.data.ranking[i].should.have.property('score');
        }
        res.body.data.should.have.property('temprange');
        res.body.data.temprange.should.be.an('array');
        res.body.data.temprange.length.should.be.eql(2);
        for (let i = 0; i < res.body.data.temprange.length; i++) {
          res.body.data.temprange[i].should.be.a('number');
        }
        res.body.pagination.should.be.ok;
        res.body.pagination.should.have.property('skip');
        res.body.pagination.should.have.property('limit');
        res.body.pagination.skip.should.be.eql(0);
        res.body.pagination.limit.should.be.eql(0);
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
        res.body.data.should.have.property('ranking');
        res.body.data.ranking.should.be.an('array');
        for (const entry of res.body.data.ranking) {
          entry.should.have.property('geonameid');
          entry.should.have.property('recordfrac');
          entry.should.have.property('recordtemp');
          entry.should.have.property('score');
          entry.should.have.property('name');
          entry.should.have.property('countryname');
          entry.should.have.property('countrycode');
          entry.should.not.have.property('localname');
        }
        res.body.data.should.have.property('temprange');
        res.body.data.temprange.should.be.an('array');
        res.body.data.temprange.length.should.be.eql(2);
        res.body.pagination.should.be.ok;
        res.body.pagination.skip.should.be.eql(0);
        res.body.pagination.limit.should.be.eql(0);
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
        res.body.data.should.have.property('ranking');
        res.body.data.ranking.should.be.an('array');
        res.body.data.ranking.length.should.be.eql(3);
        res.body.data.should.have.property('temprange');
        res.body.data.temprange.should.be.an('array');
        res.body.data.temprange.length.should.be.eql(2);
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
          res.body.data.ranking[i + 1].score.should.be.lte(
            res.body.data.ranking[i].score
          );
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
            res.body.data.should.not.have.property('population');
          }
        })
        .then(done)
        .catch(console.log);
    });
  }
});
