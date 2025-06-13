// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const verifyFirebaseToken = require('../middleware/authMiddleware');

router.post('/', verifyFirebaseToken, logController.createLog);
router.get('/summary/wilayah', logController.getSummaryByWilayah);
router.get('/detail', logController.getDetailedLogs);

module.exports = router;