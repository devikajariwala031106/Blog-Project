const Product = require('../models/Product');
const Category = require('../models/Category');
const { getPagination } = require('../utils/helpers');
const fs = require('fs');
const path = require('path');

exports.getProducts = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = 8;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const total = await Product.countDocuments(query);
    const pagination = getPagination(page, limit, total);
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.perPage);

    res.render('products/index', { title: 'Product Management', products, pagination, search });
  } catch (err) {
    req.flash('error', 'Failed to load products.');
    res.redirect('/dashboard');
  }
};

exports.getAddProduct = async (req, res) => {
  try {
    const categories = await Category.find({ status: 'active' });
    res.render('products/add', { title: 'Add Product', categories });
  } catch (err) {
    req.flash('error', 'Failed to load form.');
    res.redirect('/products');
  }
};

exports.postAddProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, status } = req.body;
    const image = req.file ? req.file.filename : '';
    await Product.create({ name, description, price, category, stock, sku, status, image });
    req.flash('success', 'Product created successfully.');
    res.redirect('/products');
  } catch (err) {
    req.flash('error', 'Failed to create product.');
    res.redirect('/products/add');
  }
};

exports.getEditProduct = async (req, res) => {
  try {
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id).populate('category'),
      Category.find({ status: 'active' })
    ]);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    res.render('products/edit', { title: 'Edit Product', product, categories });
  } catch (err) {
    req.flash('error', 'Failed to load product.');
    res.redirect('/products');
  }
};

exports.postEditProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, sku, status } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    if (req.file) {
      if (product.image) {
        const oldPath = path.join(__dirname, '../uploads', product.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.image = req.file.filename;
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.category = category;
    product.stock = stock;
    product.sku = sku;
    product.status = status;
    await product.save();
    req.flash('success', 'Product updated successfully.');
    res.redirect('/products');
  } catch (err) {
    req.flash('error', 'Failed to update product.');
    res.redirect('/products');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash('error', 'Product not found.');
      return res.redirect('/products');
    }
    if (product.image) {
      const imgPath = path.join(__dirname, '../uploads', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await Product.findByIdAndDelete(req.params.id);
    req.flash('success', 'Product deleted successfully.');
    res.redirect('/products');
  } catch (err) {
    req.flash('error', 'Failed to delete product.');
    res.redirect('/products');
  }
};
