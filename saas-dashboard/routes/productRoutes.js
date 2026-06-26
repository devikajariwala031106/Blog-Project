const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isAuthenticated } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', isAuthenticated, productController.getProducts);
router.get('/add', isAuthenticated, productController.getAddProduct);
router.post('/add', isAuthenticated, upload.single('image'), productController.postAddProduct);
router.get('/:id/edit', isAuthenticated, productController.getEditProduct);
router.post('/:id/edit', isAuthenticated, upload.single('image'), productController.postEditProduct);
router.delete('/:id', isAuthenticated, productController.deleteProduct);

module.exports = router;
