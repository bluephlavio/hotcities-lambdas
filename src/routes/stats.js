const express = require('express');
const { statsMiddleware, extraMiddleware } = require('../middlewares/stats');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware
} = require('../middlewares/common');
const { list, get } = require('../controllers/stats');

const router = express.Router();

router.get(
  '/',
  filterMiddleware('geonameid', 'name', 'countrycode'),
  sortMiddleware(),
  paginationMiddleware(),
  extraMiddleware(),
  statsMiddleware(),
  list()
);

router.get(
  '/:id',
  statsMiddleware(),
  matchMiddleware({ name: 'geonameid', dtype: Number }),
  get()
);

module.exports = router;
