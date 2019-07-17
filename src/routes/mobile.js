const express = require('express');
const { live, stats } = require('../controllers/mobile');

const router = express.Router();

router.get('/live', live());
router.get('/stats', stats());

module.exports = router;
