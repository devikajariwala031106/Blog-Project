require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const passportConfig = require('./config/passport');
const flashHelpers = require('./middleware/flashHelpers');
const routes = require('./routes/index');

connectDB();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(flashHelpers);

app.use(routes);

app.use((req, res, next) => {
  res.status(404).render('errors/404', { layout: 'layouts/auth', title: 'Page Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', { layout: 'layouts/auth', title: 'Server Error' });
});

module.exports = app;
