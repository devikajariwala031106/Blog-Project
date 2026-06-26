const Category = require('../models/Category');

exports.getCategories = async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const categories = await Category.find(query).sort({ createdAt: -1 });
    res.render('categories/index', { title: 'Category Management', categories, search });
  } catch (err) {
    req.flash('error', 'Failed to load categories.');
    res.redirect('/dashboard');
  }
};

exports.getAddCategory = (req, res) => {
  res.render('categories/add', { title: 'Add Category' });
};

exports.postAddCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) {
      req.flash('error', 'A category with this name already exists.');
      return res.redirect('/categories/add');
    }
    await Category.create({ name, description, status });
    req.flash('success', 'Category created successfully.');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error', 'Failed to create category.');
    res.redirect('/categories/add');
  }
};

exports.getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found.');
      return res.redirect('/categories');
    }
    res.render('categories/edit', { title: 'Edit Category', category });
  } catch (err) {
    req.flash('error', 'Failed to load category.');
    res.redirect('/categories');
  }
};

exports.postEditCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const existing = await Category.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
      _id: { $ne: req.params.id }
    });
    if (existing) {
      req.flash('error', 'Category name is already taken.');
      return res.redirect(`/categories/${req.params.id}/edit`);
    }
    await Category.findByIdAndUpdate(req.params.id, { name, description, status });
    req.flash('success', 'Category updated successfully.');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error', 'Failed to update category.');
    res.redirect('/categories');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    req.flash('success', 'Category deleted successfully.');
    res.redirect('/categories');
  } catch (err) {
    req.flash('error', 'Failed to delete category.');
    res.redirect('/categories');
  }
};
