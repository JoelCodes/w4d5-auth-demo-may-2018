

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || 'development';
const express = require('express');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const cookieSession = require('cookie-session');

const app = express();

const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require('./routes/users');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(cookieSession({
  secret: 'I can see why people get into My Little Pony',
}));
// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));
app.use((req, res, next) => {
  userService.getUser(req.session.userId)
    .then((user) => {
      req.user = res.locals.user = user;
      next();
    });
});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));
app.use('/styles', sass({
  src: `${__dirname}/styles`,
  dest: `${__dirname}/public/styles`,
  debug: true,
  outputStyle: 'expanded',
}));

app.use(express.static('public'));
const userService = require('./data/user-svc')(knex);
// Mount all resource routes
app.use('/api/users', usersRoutes(userService));

// Home page
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.get('/backdoor/:id', (req, res) => {
  userService.getUser(Number(req.params.id))
    .then((user) => {
      req.session.userId = user.id;
      res.redirect('/');
    });
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
