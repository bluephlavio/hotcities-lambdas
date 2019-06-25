const express = require('express');
const City = require('../models/city');
const {
  buildCursorMiddleware,
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware
} = require('../middlewares/api');
const { get } = require('../controllers/api');

const router = express.Router();

router.get(
  '/cities',
  buildCursorMiddleware(City),
  // filterMiddleware('geonameid', 'name', 'population', 'countrycode', 'timezone', 'lng', 'lat'),
  sortMiddleware(),
  paginationMiddleware(),
  get()
);

module.exports = router;
