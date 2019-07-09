const express = require('express');
const { live } = require('../controllers/web');

const router = express.Router();

router.get('/live', live());

module.exports = router;
