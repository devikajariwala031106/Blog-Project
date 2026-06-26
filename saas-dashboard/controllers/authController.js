const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    layout: 'layouts/auth',
    title: 'Sign In — SaaS Dashboard'
  });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success', 'You have been logged out successfully.');
    res.redirect('/auth/login');
  });
};

exports.getForgotPassword = (req, res) => {
  res.render('auth/forgot-password', {
    layout: 'layouts/auth',
    title: 'Forgot Password — SaaS Dashboard'
  });
};

exports.postForgotPassword = (req, res) => {
  req.flash('info', 'If an account exists with that email, a reset link has been sent.');
  res.redirect('/auth/forgot-password');
};

exports.getChangePassword = (req, res) => {
  res.render('auth/change-password', {
    title: 'Change Password'
  });
};

exports.postChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      req.flash('error', 'New passwords do not match.');
      return res.redirect('/auth/change-password');
    }
    if (newPassword.length < 6) {
      req.flash('error', 'Password must be at least 6 characters long.');
      return res.redirect('/auth/change-password');
    }
    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect('/auth/change-password');
    }
    user.password = newPassword;
    await user.save();
    req.flash('success', 'Password changed successfully.');
    res.redirect('/auth/change-password');
  } catch (err) {
    req.flash('error', 'An error occurred. Please try again.');
    res.redirect('/auth/change-password');
  }
};
