const express = require('express');

const router = express.Router();

router.use('/cities', require('./cities'));

module.exports = router;
