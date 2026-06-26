const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalCategories, totalProducts, recentUsers] = await Promise.all([
      User.countDocuments(),
      Category.countDocuments(),
      Product.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role status createdAt avatar')
    ]);

    const activeProducts = await Product.countDocuments({ status: 'active' });
    const activeUsers = await User.countDocuments({ status: 'active' });

    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('category', 'name');

    const monthlyData = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = await User.countDocuments({
        createdAt: { $gte: date, $lte: endDate }
      });
      monthlyData.push({
        month: date.toLocaleString('default', { month: 'short' }),
        count
      });
    }

    res.render('dashboard/index', {
      title: 'Dashboard',
      totalUsers,
      totalCategories,
      totalProducts,
      activeProducts,
      activeUsers,
      recentUsers,
      recentProducts,
      monthlyData: JSON.stringify(monthlyData)
    });
  } catch (err) {
    req.flash('error', 'Failed to load dashboard data.');
    res.render('dashboard/index', {
      title: 'Dashboard',
      totalUsers: 0,
      totalCategories: 0,
      totalProducts: 0,
      activeProducts: 0,
      activeUsers: 0,
      recentUsers: [],
      recentProducts: [],
      monthlyData: '[]'
    });
  }
};
