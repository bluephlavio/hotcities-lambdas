const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiDatetime = require('chai-datetime');
const { app } = require('../../src/server');
const { getCities } = require('../data/factory');

chai.should();
chai.use(chaiHttp);
chai.use(chaiDatetime);

describe('GET /records', function() {
  it('should get all records', function(done) {
    chai
      .request(app)
      .get('/records')
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
      .get('/records?limit=3&skip=1')
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

  it('should sort correctly by timestamp', function(done) {
    chai
      .request(app)
      .get('/records?sort=-timestamp')
      .then(res => {
        res.should.have.status(200);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          new Date(res.body.data[i + 1].timestamp).should.be.beforeTime(
            new Date(res.body.data[i].timestamp)
          );
        }
      })
      .then(done)
      .catch(console.log);
  });

  it('should filter correctly by temp', function(done) {
    chai
      .request(app)
      .get('/records?temp=>45')
      .then(res => {
        res.should.have.status(200);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          res.body.data[i].temp.should.be.gt(45);
        }
      })
      .then(done)
      .catch(console.log);
  });

  it('should filter correctly by temp range', function(done) {
    chai
      .request(app)
      .get('/records?temp=>42,<45')
      .then(res => {
        res.should.have.status(200);
        for (let i = 0; i < res.body.data.length - 1; i++) {
          res.body.data[i].temp.should.be.gt(42);
          res.body.data[i].temp.should.be.lt(45);
        }
      })
      .then(done)
      .catch(console.log);
  });
});

describe('GET /records/current', function() {
  it('should return the latest record', function(done) {
    chai
      .request(app)
      .get('/records/current')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.have.property('geonameid');
        res.body.data.should.have.property('temp');
        res.body.data.should.have.property('timestamp');
      })
      .then(done)
      .catch(console.log);
  });
});

describe('GET /records/record', function() {
  it('should return the record of records', function(done) {
    chai
      .request(app)
      .get('/records/record')
      .then(res => {
        res.should.have.status(200);
        res.body.data.should.have.property('geonameid');
        res.body.data.should.have.property('temp');
        res.body.data.should.have.property('timestamp');
      })
      .then(done)
      .catch(console.log);
  });
});
