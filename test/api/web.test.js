const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/server');

chai.use(chaiHttp);
chai.should();

describe('GET /web/live', function () {
  it('should return correct data', function (done) {
    chai
      .request(app)
      .get('/web/live')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('current');
        res.body.data.current.should.have.property('temp');
        res.body.data.current.should.have.property('timestamp');
        res.body.data.current.should.have.property('geonameid');
        res.body.data.current.should.have.property('name');
        res.body.data.current.should.have.property('localname');
        res.body.data.current.should.have.property('countryname');
        res.body.data.current.should.have.property('countrycode');
        res.body.data.current.should.have.property('lat');
        res.body.data.current.should.have.property('lng');
        res.body.data.current.should.have.property('population');
        res.body.data.current.should.have.property('photos');
        res.body.data.current.photos.should.be.an('array');
        for (const photo of res.body.data.current.photos) {
          photo.should.have.property('src');
        }
        res.body.data.should.have.property('stats');
        res.body.data.stats.should.have.property('temprange');
        res.body.data.stats.temprange.should.be.an('array');
        res.body.data.stats.temprange.length.should.be.eql(2);
      })
      .then(done)
      .catch(console.log);
  });
});

describe('GET /web/stats', function () {
  it('should return correct data', function (done) {
    chai
      .request(app)
      .get('/web/stats')
      .then((res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('ranking');
        res.body.data.ranking.should.be.an('array');
        for (const entry of res.body.data.ranking) {
          entry.should.have.property('geonameid');
          entry.should.have.property('recordfrac');
          entry.should.have.property('recordtemp');
          entry.should.have.property('score');
        }
        res.body.data.should.have.property('temprange');
        res.body.data.temprange.should.be.an('array');
        res.body.data.temprange.length.should.be.eql(2);
        res.body.data.temprange[0].should.be.a('number');
        res.body.data.temprange[1].should.be.a('number');
        res.body.data.temprange[1].should.not.be.lt(res.body.data.temprange[0]);
      })
      .then(done)
      .catch(console.log);
  });
});
