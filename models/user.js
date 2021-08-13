const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const AuthorisationError = require('../errors/authorisation-error');

const { ERROR_MESSAGE_AUTHORISATION, ERROR_MESSAGE_NOT_VALID_DATA_FORMAT } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: ERROR_MESSAGE_NOT_VALID_DATA_FORMAT,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findByEmail = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError(ERROR_MESSAGE_AUTHORISATION);
      }
      return bcrypt.compare(password, user.password)
        .then((match) => {
          if (match) return user;
          throw new AuthorisationError(ERROR_MESSAGE_AUTHORISATION);
        });
    });
};

module.exports = mongoose.model('user', userSchema);
