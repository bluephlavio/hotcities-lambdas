const express = require('express');
const Record = require('../models/record');
const {
  matchMiddleware,
  filterMiddleware,
  sortMiddleware,
  paginationMiddleware
} = require('../middlewares/common');
const { list, get } = require('../controllers/common');
const { current } = require('../controllers/records');

const router = express.Router();

router.get(
  '/',
  filterMiddleware('geonameid', 'temp', 'timestamp'),
  sortMiddleware(),
  paginationMiddleware(),
  list(Record)
);

router.get('/current', current());

router.get('/:id', matchMiddleware(), get(Record));

module.exports = router;
