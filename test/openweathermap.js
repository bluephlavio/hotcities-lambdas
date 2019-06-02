const { expect } = require('chai');
const { getCities } = require('./data');
const { getWeather } = require('../src/openweathermap');

describe('openweathermap', function() {
    describe('getWeather', function() {
        let cities = getCities();
        let weather = null;

        before(async function() {
            weather = await getWeather(cities);
        });

        it('should work', function() {
            expect(weather).to.be.ok;
        });

        it('should return list', async function() {
            expect(weather).to.be.an('array');
            expect(weather.length).to.be.equal(cities.length);
        });

        it('should have a proper data structure', function()  {
            weather.forEach(city => {
                expect(city).to.have.property('id');
                expect(city).to.have.nested.property('main.temp');
            });
        });
    });
});