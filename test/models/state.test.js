const chai = require('chai');
const sinon = require('sinon');
const _ = require('lodash');
const Record = require('../../src/models/record');
const Photo = require('../../src/models/photo');
const State = require('../../src/models/state');
const { getCities, getRecords, getPhotos } = require('../data/factory');

chai.should();

describe('State model', function() {
  before(function() {
    sinon.stub(Record, 'current').callsFake(() =>
      _.chain(getRecords())
        .orderBy(['timestamp'], ['desc'])
        .first()
        .value()
    );
    sinon.stub(Record, 'ranking').callsFake(() => {
      const records = getRecords();
      const cities = getCities();
      const count = records.length;
      const ranking = _.chain(records)
        .groupBy('geonameid')
        .toPairs()
        .map(entry => ({
          geonameid: Number(entry[0]),
          recordfrac: entry[1].length / count,
          recordtemp: _.chain(entry[1])
            .map(({ temp }) => temp)
            .max()
            .value()
        }))
        .value();
      const maxRecordFrac = _.chain(ranking)
        .map(({ recordfrac }) => recordfrac)
        .max()
        .value();
      const maxRecordTemp = _.chain(ranking)
        .map(({ recordtemp }) => recordtemp)
        .max()
        .value();
      const normalization = maxRecordFrac * maxRecordTemp;
      return _.chain(ranking)
        .map(({ recordfrac, recordtemp, ...rest }) => ({
          recordfrac,
          recordtemp,
          score: (recordfrac * recordtemp) / normalization,
          ...rest
        }))
        .map(({ geonameid, ...rest }) =>
          Object.assign(
            { ...rest },
            _.omit(_.find(cities, city => city.geonameid === geonameid), '_id')
          )
        )
        .value();
    });
    sinon.stub(Record, 'tempRange').callsFake(() => [
      _.chain(getRecords())
        .map(({ temp }) => temp)
        .min()
        .value(),
      _.chain(getRecords())
        .map(({ temp }) => temp)
        .max()
        .value()
    ]);
    sinon.stub(Photo, 'findByGeonameid').callsFake((geonameid, { limit }) =>
      _.chain(getPhotos())
        .filter(photo => photo.geonameid === geonameid)
        .slice(0, limit)
        .value()
    );
  });

  after(function() {
    Record.current.restore();
    Record.ranking.restore();
    Record.tempRange.restore();
    Photo.findByGeonameid.restore();
  });

  it('should return a state object when build is called', async function() {
    const state = await State.build();
    state.should.be.ok;
    state.should.have.property('current');
    state.should.have.property('stats');
  });
});
