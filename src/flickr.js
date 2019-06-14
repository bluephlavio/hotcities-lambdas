const Flickr = require('flickr-sdk');
const _ = require('lodash');
const config = require('./config');

const flickr = new Flickr(config.flickr.key);

const taggify = tag => {
  return tag.toLowerCase().replace(/\s/g, '');
};

const commonTags = [
  'panorama',
  'skyline',
  'architecture',
  'building',
  'skyscraper',
  'art',
  'mosque',
  'masjid',
  'church',
  'temple',
  'street',
  'park',
  'bridge',
  'metro',
  'station',
  'square',
  '-meetings',
  '-conferences'
];

const licenses = [
  { id: '0', name: 'All Rights Reserved', url: '' },
  { id: '4', name: 'Attribution License', url: 'https://creativecommons.org/licenses/by/2.0/' },
  {
    id: '6',
    name: 'Attribution-NoDerivs License',
    url: 'https://creativecommons.org/licenses/by-nd/2.0/'
  },
  {
    id: '3',
    name: 'Attribution-NonCommercial-NoDerivs License',
    url: 'https://creativecommons.org/licenses/by-nc-nd/2.0/'
  },
  {
    id: '2',
    name: 'Attribution-NonCommercial License',
    url: 'https://creativecommons.org/licenses/by-nc/2.0/'
  },
  {
    id: '1',
    name: 'Attribution-NonCommercial-ShareAlike License',
    url: 'https://creativecommons.org/licenses/by-nc-sa/2.0/'
  },
  {
    id: '5',
    name: 'Attribution-ShareAlike License',
    url: 'https://creativecommons.org/licenses/by-sa/2.0/'
  },
  {
    id: '7',
    name: 'No known copyright restrictions',
    url: 'https://www.flickr.com/commons/usage/'
  },
  { id: '8', name: 'United States Government Work', url: 'http://www.usa.gov/copyright.shtml' },
  {
    id: '9',
    name: 'Public Domain Dedication (CC0)',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/'
  },
  {
    id: '10',
    name: 'Public Domain Mark',
    url: 'https://creativecommons.org/publicdomain/mark/1.0/'
  }
];

const okLicenses = [1, 2, 4, 5, 7, 9, 10];

const getLicenseById = id => {
  return _.find(licenses, license => license.id == id);
};

const getUserUrl = id => {
  return `https://www.flickr.com/people/${id}`;
};

const searchPhotos = async (city, n = 100) => {
  const { lat, lng: lon, name, geonameid } = city;
  const res = await flickr.photos.search({
    format: 'json',
    license: okLicenses.join(','),
    sort: 'relevance',
    per_page: n,
    has_geo: '1',
    lat,
    lon,
    radius: 30,
    tags: _.chain(commonTags)
      .sampleSize(10)
      .concat([name])
      .map(taggify)
      .value()
      .join(','),
    extras: 'url_l,owner_name,license'
  });
  const photos = res.body.photos.photo;
  return _.chain(photos)
    .map(({ license: licenseid, ...rest }) => {
      const { name, url } = getLicenseById(licenseid);
      return {
        license: { name, url },
        ...rest
      };
    })
    .map(({ owner: ownerid, ownername: name, ...rest }) => ({
      owner: {
        name,
        url: getUserUrl(ownerid)
      },
      ...rest
    }))
    .map(({ id, url_l: url, title, license, owner }) => ({
      id,
      geonameid,
      url,
      title,
      license,
      owner
    }))
    .value();
};

module.exports = {
  searchPhotos
};
