const express = require('express');
const City = require('../models/city');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware
} = require('../middlewares/util');
const { list, get } = require('../controllers/crud');

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

router.get('/:id', matchMiddleware(), get(City));

module.exports = router;