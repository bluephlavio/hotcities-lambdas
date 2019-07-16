const express = require('express');
const { live } = require('../controllers/mobile');

const router = express.Router();

router.get('/live', live());

module.exports = router;
