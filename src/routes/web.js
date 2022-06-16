const express = require('express');
const { live, stats, all } = require('../controllers/web');

const router = express.Router();

router.get('/', all());
router.get('/live', live());
router.get('/stats', stats());

module.exports = router;
