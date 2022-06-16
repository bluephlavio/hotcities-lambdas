const express = require('express');
const Photo = require('../models/photo');
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
  filterMiddleware('geonameid'),
  sortMiddleware(),
  paginationMiddleware(),
  list(Photo)
);

router.get('/:id', matchMiddleware({ name: 'id', dtype: String }), get(Photo));

module.exports = router;
