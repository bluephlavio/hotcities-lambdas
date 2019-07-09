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
        res.body.should.have.property('record');
        res.body.record.should.have.property('temp');
        res.body.record.should.have.property('timestamp');
        res.body.should.have.property('city');
        res.body.city.should.have.property('geonameid');
        res.body.city.should.have.property('name');
        res.body.city.should.have.property('localname');
        res.body.city.should.have.property('countryname');
        res.body.city.should.have.property('countrycode');
        res.body.city.should.have.property('timezone');
        res.body.city.should.have.property('lat');
        res.body.city.should.have.property('lng');
        res.body.city.should.have.property('lang');
        res.body.city.should.have.property('population');
        res.body.should.have.property('photos');
        res.body.photos.should.be.an('array');
        res.body.should.have.property('maxTemp');
        res.body.maxTemp.should.be.a('number');
        res.body.should.have.property('minTemp');
        res.body.minTemp.should.be.a('number');
        res.body.minTemp.should.be.lte(res.body.maxTemp);
      })
      .then(done)
      .catch(console.log);
  });
});
