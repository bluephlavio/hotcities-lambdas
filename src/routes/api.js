const express = require('express');
const City = require('../models/city');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware
} = require('../middlewares/api');
const { list, get } = require('../controllers/api');

const router = express.Router();

router.get(
  '/cities',
  filterMiddleware(
    null,
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

router.get('/cities/:id', matchMiddleware(), get(City));

module.exports = router;
