// routes/konveyorRoutes.js
const express = require('express');
const router = express.Router();
const konveyorController = require('../controllers/konveyorController');
const verifyFirebaseToken = require('../middleware/authMiddleware');

// POST /konveyor/rpm
router.post('/rpm', verifyFirebaseToken, konveyorController.setRpm);

// GET /konveyor/rpm
router.get('/rpm', konveyorController.getRpm);

module.exports = router;