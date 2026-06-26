const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, categoryController.getCategories);
router.get('/add', isAuthenticated, categoryController.getAddCategory);
router.post('/add', isAuthenticated, categoryController.postAddCategory);
router.get('/:id/edit', isAuthenticated, categoryController.getEditCategory);
router.post('/:id/edit', isAuthenticated, categoryController.postEditCategory);
router.delete('/:id', isAuthenticated, categoryController.deleteCategory);

module.exports = router;
