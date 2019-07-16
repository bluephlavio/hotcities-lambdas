const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../src/server');

chai.use(chaiHttp);
chai.should();

describe('GET /mobile/live', function() {
  it('should return correct data', function(done) {
    chai
      .request(app)
      .get('/mobile/live')
      .then(res => {
        res.should.have.status(200);
        res.body.should.have.property('record');
        res.body.record.should.have.property('temp');
        res.body.record.should.have.property('timestamp');
        res.body.record.should.have.property('geonameid');
        res.body.record.should.have.property('name');
        res.body.record.should.have.property('localname');
        res.body.record.should.have.property('countryname');
        res.body.record.should.have.property('countrycode');
        res.body.record.should.have.property('timezone');
        res.body.record.should.have.property('lat');
        res.body.record.should.have.property('lng');
        res.body.record.should.have.property('lang');
        res.body.record.should.have.property('population');
        res.body.should.have.property('photos');
        res.body.photos.should.be.an('array');
        res.body.should.have.property('stats');
        res.body.stats.should.have.property('recordfrac');
        res.body.stats.should.have.property('recordtemp');
        res.body.stats.should.have.property('score');
        res.body.stats.should.have.property('rank');
        res.body.should.have.property('range');
        res.body.range.should.have.property('minTemp');
        res.body.range.should.have.property('maxTemp');
      })
      .then(done)
      .catch(console.log);
  });
});
