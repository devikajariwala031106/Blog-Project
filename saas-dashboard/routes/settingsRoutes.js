const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, settingsController.getSettings);
router.post('/account', isAuthenticated, settingsController.postAccountSettings);
router.post('/security', isAuthenticated, settingsController.postSecuritySettings);
router.post('/system', isAuthenticated, settingsController.postSystemSettings);

module.exports = router;
