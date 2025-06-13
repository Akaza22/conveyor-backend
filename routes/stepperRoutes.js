// routes/stepperRoutes.js
const express = require('express');
const router = express.Router();
const stepperController = require('../controllers/stepperController');
const verifyFirebaseToken = require('../middleware/authMiddleware');

// POST /stepper/putar
router.post('/putar', verifyFirebaseToken, stepperController.setRotation);

// GET /stepper/status
router.get('/status', stepperController.getStatus);

module.exports = router;