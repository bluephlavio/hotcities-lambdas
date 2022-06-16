const express = require('express');
const City = require('../models/city');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware,
} = require('../middlewares/common');
const { list, get } = require('../controllers/common');

const router = express.Router();

router.get(
  '/',
  filterMiddleware(
    'geonameid',
    'name',
    'localname',
    'population',
    'countrycode',
    'countryname',
    'timezone',
    'lng',
    'lat',
    'lang'
  ),
  sortMiddleware(),
  paginationMiddleware(),
  list(City)
);

router.get(
  '/:id',
  matchMiddleware({ name: 'geonameid', dtype: Number }),
  get(City)
);

module.exports = router;
