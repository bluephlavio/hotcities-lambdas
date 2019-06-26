const express = require('express');
const { stats } = require('../controllers/stats');

const router = express.Router();

router.get('/', stats());

module.exports = router;
