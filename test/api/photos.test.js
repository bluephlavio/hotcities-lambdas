const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDatetime = require('chai-datetime');
const { app } = require('../../src/server');
const { getCities } = require('../data/factory');

chai.should();
chai.use(chaiHttp);
chai.use(chaiDatetime);

describe('GET /photos', function() {
  it('should get all photos', function(done) {
    chai
      .request(app)
      .get('/photos')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.be.ok;
        res.body.data.should.be.an('array');
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
      .get('/photos?limit=3&skip=1')
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

  const cities = getCities();
  for (const city of cities) {
    const { geonameid } = city;
    it('should filter correctly by geonameid', function(done) {
      chai
        .request(app)
        .get(`/photos?geonameid=${geonameid}`)
        .then(res => {
          res.should.have.status(200);
          for (let i = 0; i < res.body.data.length - 1; i++) {
            res.body.data[i].geonameid.should.be.eql(geonameid);
          }
        })
        .then(done)
        .catch(console.log);
    });
  }
});
