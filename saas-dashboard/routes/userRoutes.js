const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, userController.getUsers);
router.get('/add', isAuthenticated, userController.getAddUser);
router.post('/add', isAuthenticated, userController.postAddUser);
router.get('/:id/edit', isAuthenticated, userController.getEditUser);
router.post('/:id/edit', isAuthenticated, userController.postEditUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;
