const express = require('express');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware,
  extraMiddleware,
} = require('../middlewares/common');
const { list, get } = require('../controllers/stats');

const router = express.Router();

router.get(
  '/',
  filterMiddleware(
    'geonameid',
    'name',
    'localname',
    'coutryname',
    'countrycode',
    'timezone',
    'lat',
    'lng',
    'lang',
    'population'
  ),
  sortMiddleware(),
  paginationMiddleware(),
  extraMiddleware(),
  list()
);

router.get(
  '/:id',
  matchMiddleware({ name: 'geonameid', dtype: Number }),
  extraMiddleware(),
  get()
);

module.exports = router;
