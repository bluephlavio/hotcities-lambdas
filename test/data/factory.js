module.exports.getCities = () => {
  return [
    {
      geonameid: 292968,
      name: 'Abu Dhabi',
      population: 603492,
      timezone: 'Asia/Dubai',
      country: 'United Arab Emirates',
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
      country: 'United Arab Emirates',
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
      country: 'United Arab Emirates',
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
