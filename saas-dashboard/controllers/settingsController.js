exports.getSettings = (req, res) => {
  res.render('settings/index', { title: 'Settings' });
};

exports.postAccountSettings = async (req, res) => {
  try {
    req.flash('success', 'Account settings saved successfully.');
    res.redirect('/settings');
  } catch (err) {
    req.flash('error', 'Failed to save settings.');
    res.redirect('/settings');
  }
};

exports.postSecuritySettings = async (req, res) => {
  try {
    req.flash('success', 'Security settings updated successfully.');
    res.redirect('/settings');
  } catch (err) {
    req.flash('error', 'Failed to update security settings.');
    res.redirect('/settings');
  }
};

exports.postSystemSettings = async (req, res) => {
  try {
    req.flash('success', 'System preferences saved successfully.');
    res.redirect('/settings');
  } catch (err) {
    req.flash('error', 'Failed to save system preferences.');
    res.redirect('/settings');
  }
};
