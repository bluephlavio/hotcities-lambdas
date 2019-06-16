module.exports.getCities = () => {
  return [
    {
      geonameid: 292968,
      name: 'Abu Dhabi',
      population: 603492,
      timezone: 'Asia/Dubai',
      countryname: 'United Arab Emirates',
      lang: 'ar-AE',
      localname: 'أبوظبي',
      lng: 54.36667,
      lat: 24.46667,
      countrycode: 'AE'
    },
    {
      geonameid: 292223,
      name: 'Dubai',
      population: 1137347,
      timezone: 'Asia/Dubai',
      countryname: 'United Arab Emirates',
      lang: 'ar-AE',
      localname: 'دبي',
      lng: 55.17128,
      lat: 25.0657,
      countrycode: 'AE'
    },
    {
      geonameid: 292672,
      name: 'Sharjah',
      population: 543733,
      timezone: 'Asia/Dubai',
      countryname: 'United Arab Emirates',
      lang: 'ar-AE',
      localname: 'إمارة الشارقة',
      lng: 55.41206,
      lat: 25.33737,
      countrycode: 'AE'
    }
  ];
};

module.exports.getWeather = () => {
  const now = new Date();
  return [
    {
      geonameid: 292968,
      temp: 52,
      timestamp: now - 0
    },
    {
      geonameid: 292223,
      temp: 51,
      timestamp: now - 1
    },
    {
      geonameid: 292672,
      temp: 50,
      timestamp: now - 2
    }
  ];
};

module.exports.getRecords = () => {
  const now = new Date();
  return [
    {
      geonameid: 292968,
      temp: 52,
      timestamp: now - 0
    },
    {
      geonameid: 292223,
      temp: 51,
      timestamp: now - 1
    },
    {
      geonameid: 292968,
      temp: 52,
      timestamp: now - 2
    }
  ];
};

module.exports.getPhotos = () => {
  return [
    {
      id: 22996521903,
      geonameid: 292968,
      url: 'https://live.staticflickr.com/648/22996521903_6419c46526_b.jpg',
      title: 'In the holiday spirit @acsabudhabi',
      license: { name: 'Attribution License', url: 'https://creativecommons.org/licenses/by/2.0/' },
      owner: { name: 'ToGa Wanderings', url: 'https://www.flickr.com/people/69031678@N00' },
      timestamp: '2019-06-16T17:27:31.227Z'
    },
    {
      id: 47944445861,
      geonameid: 292223,
      url: 'https://live.staticflickr.com/65535/47944445861_4ace478814_b.jpg',
      title: 'Creek side view of Dubai downtown',
      license: { name: 'Attribution License', url: 'https://creativecommons.org/licenses/by/2.0/' },
      owner: { name: 'paulmorj', url: 'https://www.flickr.com/people/26812398@N00' },
      timestamp: '2019-06-16T17:27:32.162Z'
    },
    {
      id: 47037942514,
      geonameid: 292223,
      url: 'https://live.staticflickr.com/65535/47037942514_15615590b0_b.jpg',
      title: 'Burj Khalifa',
      license: {
        name: 'Attribution-ShareAlike License',
        url: 'https://creativecommons.org/licenses/by-sa/2.0/'
      },
      owner: { name: 'Strocchi', url: 'https://www.flickr.com/people/46383895@N00' },
      timestamp: '2019-06-16T17:27:32.164Z'
    },
    {
      id: 47944445861,
      geonameid: 292672,
      url: 'https://live.staticflickr.com/65535/47944445861_4ace478814_b.jpg',
      title: 'Creek side view of Dubai downtown',
      license: { name: 'Attribution License', url: 'https://creativecommons.org/licenses/by/2.0/' },
      owner: { name: 'paulmorj', url: 'https://www.flickr.com/people/26812398@N00' },
      timestamp: '2019-06-16T17:27:32.656Z'
    },
    {
      id: 47037942514,
      geonameid: 292672,
      url: 'https://live.staticflickr.com/65535/47037942514_15615590b0_b.jpg',
      title: 'Burj Khalifa',
      license: {
        name: 'Attribution-ShareAlike License',
        url: 'https://creativecommons.org/licenses/by-sa/2.0/'
      },
      owner: { name: 'Strocchi', url: 'https://www.flickr.com/people/46383895@N00' },
      timestamp: '2019-06-16T17:27:32.657Z'
    }
  ];
};
