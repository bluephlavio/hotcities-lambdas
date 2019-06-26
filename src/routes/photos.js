const express = require('express');
const Photo = require('../models/photo');
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
  filterMiddleware('geonameid'),
  sortMiddleware(),
  paginationMiddleware(),
  list(Photo)
);

router.get('/:id', matchMiddleware(), get(Photo));

module.exports = router;
