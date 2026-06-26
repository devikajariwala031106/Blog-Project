module.exports = (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  res.locals.currentUser = req.user || null;
  res.locals.currentPath = req.path;
  next();
};
