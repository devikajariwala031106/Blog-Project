const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, profileController.getProfile);
router.post('/update', isAuthenticated, profileController.postUpdateProfile);
router.post('/update-password', isAuthenticated, profileController.postUpdatePassword);
router.post('/update-avatar', isAuthenticated, upload.single('avatar'), profileController.postUpdateAvatar);

module.exports = router;
