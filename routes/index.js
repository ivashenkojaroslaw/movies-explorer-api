const auth = require('../middlewares/auth');
const signup = require('./signup');
const signin = require('./signin');
const user = require('./user');
const movie = require('./movie');
const otherPaths = require('./otherPaths');

module.exports = function (app) {
  app.use('/signup', signup);
  app.use('/signin', signin);

  app.use(auth);

  app.use('/users', user);
  app.use('/movies', movie);

  app.use('*', otherPaths);
};
