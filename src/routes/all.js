const express = require('express');

const router = express.Router();

router.use('/cities', require('./cities'));
router.use('/records', require('./records'));
router.use('/photos', require('./photos'));
router.use('/stats', require('./stats'));

module.exports = router;
