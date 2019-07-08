const express = require('express');
const { liveController } = require('../controllers/pages');

const router = express.Router();

router.get('/live', liveController());
