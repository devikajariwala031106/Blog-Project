const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { getPagination } = require('../utils/helpers');

exports.getUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = req.query.page || 1;
    const limit = 8;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const total = await User.countDocuments(query);
    const pagination = getPagination(page, limit, total);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.perPage);

    res.render('users/index', {
      title: 'User Management',
      users,
      pagination,
      search
    });
  } catch (err) {
    req.flash('error', 'Failed to load users.');
    res.redirect('/dashboard');
  }
};

exports.getAddUser = (req, res) => {
  res.render('users/add', { title: 'Add User' });
};

exports.postAddUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, status } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash('error', 'A user with this email already exists.');
      return res.redirect('/users/add');
    }

    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/users/add');
    }

    await User.create({ name, email, password, role, phone, status });
    req.flash('success', 'User created successfully.');
    res.redirect('/users');
  } catch (err) {
    req.flash('error', 'Failed to create user.');
    res.redirect('/users/add');
  }
};

exports.getEditUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    res.render('users/edit', { title: 'Edit User', editUser: user });
  } catch (err) {
    req.flash('error', 'Failed to load user.');
    res.redirect('/users');
  }
};

exports.postEditUser = async (req, res) => {
  try {
    const { name, email, role, phone, status, bio, location } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }

    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.params.id } });
    if (existing) {
      req.flash('error', 'Email is already in use by another account.');
      return res.redirect(`/users/${req.params.id}/edit`);
    }

    user.name = name;
    user.email = email;
    user.role = role;
    user.phone = phone || '';
    user.status = status;
    user.bio = bio || '';
    user.location = location || '';
    await user.save();

    req.flash('success', 'User updated successfully.');
    res.redirect('/users');
  } catch (err) {
    req.flash('error', 'Failed to update user.');
    res.redirect('/users');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash('error', 'User not found.');
      return res.redirect('/users');
    }
    if (user._id.toString() === req.user._id.toString()) {
      req.flash('error', 'You cannot delete your own account.');
      return res.redirect('/users');
    }
    await User.findByIdAndDelete(req.params.id);
    req.flash('success', 'User deleted successfully.');
    res.redirect('/users');
  } catch (err) {
    req.flash('error', 'Failed to delete user.');
    res.redirect('/users');
  }
};
