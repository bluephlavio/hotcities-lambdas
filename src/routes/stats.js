const express = require('express');
const { stats } = require('../controllers/stats');
const { filterMiddleware, sortMiddleware, paginationMiddleware } = require('../middlewares/common');

const router = express.Router();

router.get(
  '/',
  filterMiddleware('geonameid', 'name', 'countrycode'),
  sortMiddleware(),
  paginationMiddleware(),
  (req, res, next) => {
    const { query } = req;
    if ('extra' in query) {
      const { extra: value } = query;
      res.extra = Object.assign({}, ...value.split(',').map(field => ({ [field]: 1 })));
    }
    next();
  },
  stats()
);

module.exports = router;
