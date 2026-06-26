const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getProfile = (req, res) => {
  res.render('profile/index', { title: 'My Profile' });
};

exports.postUpdateProfile = async (req, res) => {
  try {
    const { name, phone, bio, location } = req.body;
    if (!name || name.trim().length < 2) {
      req.flash('error', 'Name must be at least 2 characters.');
      return res.redirect('/profile');
    }
    await User.findByIdAndUpdate(req.user._id, { name, phone, bio, location });
    req.flash('success', 'Profile updated successfully.');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Failed to update profile.');
    res.redirect('/profile');
  }
};

exports.postUpdatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/profile');
    }
    if (newPassword.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/profile');
    }
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/profile');
    }
    user.password = newPassword;
    await user.save();
    req.flash('success', 'Password updated successfully.');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Failed to update password.');
    res.redirect('/profile');
  }
};

exports.postUpdateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      req.flash('error', 'Please select an image to upload.');
      return res.redirect('/profile');
    }
    await User.findByIdAndUpdate(req.user._id, { avatar: req.file.filename });
    req.flash('success', 'Avatar updated successfully.');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error', 'Failed to update avatar.');
    res.redirect('/profile');
  }
};
