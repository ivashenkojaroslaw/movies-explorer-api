require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-error');
const DataRequestError = require('../errors/data-request-error');
const ConflictError = require('../errors/conflict-error');

const { ERROR_MESSAGE_USER_DATA_REQUEST, ERROR_MESSAGE_CONFLICT_USER_EMAIL, ERROR_MESSAGE_NOT_FOUND_USER } = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then(() => res.send({
          data: {
            name, email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            const error = new DataRequestError(ERROR_MESSAGE_USER_DATA_REQUEST);
            next(error);
          } else if (err.name === 'MongoError' && err.code === 11000) {
            const error = new ConflictError(ERROR_MESSAGE_CONFLICT_USER_EMAIL);
            next(error);
          }
          next(err);
        });
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER);
        next(error);
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER);
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError(ERROR_MESSAGE_NOT_FOUND_USER);
        next(error);
      } else if (err.name === 'ValidationError') {
        const error = new DataRequestError(ERROR_MESSAGE_USER_DATA_REQUEST);
        next(error);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findByEmail(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
