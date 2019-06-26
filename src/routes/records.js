const express = require('express');
const Record = require('../models/record');
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
  filterMiddleware('geonameid', 'temp', 'timestamp'),
  sortMiddleware(),
  paginationMiddleware(),
  list(Record)
);

router.get(
  '/current',
  (req, res, next) => {
    res.sort = { timestamp: -1 };
    next();
  },
  get(Record)
);

router.get('/:id', matchMiddleware(), get(Record));

module.exports = router;
