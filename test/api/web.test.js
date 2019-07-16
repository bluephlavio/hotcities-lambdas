const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/server');

chai.use(chaiHttp);
chai.should();

describe('GET /web/live', function() {
  it('should return correct data', function(done) {
    chai
      .request(app)
      .get('/web/live')
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property('current');
        res.body.current.should.have.property('temp');
        res.body.current.should.have.property('timestamp');
        res.body.current.should.have.property('geonameid');
        res.body.current.should.have.property('name');
        res.body.current.should.have.property('localname');
        res.body.current.should.have.property('countryname');
        res.body.current.should.have.property('countrycode');
        res.body.current.should.have.property('lat');
        res.body.current.should.have.property('lng');
        res.body.current.should.have.property('population');
        res.body.current.should.have.property('photos');
        res.body.current.photos.should.be.an('array');
        res.body.should.have.property('stats');
        res.body.stats.should.have.property('ranking');
        res.body.stats.ranking.should.be.an('array');
        res.body.stats.should.have.property('temprange');
        res.body.stats.temprange.should.be.an('array');
      })
      .then(done)
      .catch(console.log);
  });
});
