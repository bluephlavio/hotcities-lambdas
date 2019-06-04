const { expect } = require('chai');
const mongoose = require('mongoose');
const config = require('../src/config');
const { getAllGeonameids } = require('../src/helpers');
const { getCities } = require('./data');

describe('helpers', function() {
    describe('getAllGeonameids', function() {
        
        before(function(done) {
            mongoose.connect(config.mongo.connection, { useNewUrlParser: true });
            mongoose.connection.on('open', done);
        });

        after(function(done) {
            mongoose.connection.on('close', done);
            mongoose.connection.close();
        });

        it('should be a list', async function() {
            const geonameids = await getAllGeonameids();
            expect(geonameids).to.be.an('array');
        });
        
        it('should return some geonameids', async function() {
            const geonameids = await getAllGeonameids();
            const cities = getCities();
            cities.forEach(city => {
                const { geonameid } = city;
                expect(geonameids).to.contain(geonameid);
            });
        });
    
    });
});