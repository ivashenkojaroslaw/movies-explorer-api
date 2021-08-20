const mongoose = require('mongoose');
const validator = require('validator');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');

const {
  ERROR_MESSAGE_NOT_FOUND_FILM, ERROR_MESSAGE_FORBIDDEN,
  ERROR_MESSAGE_CONFLICT_FILM_IN_USER_LIST, ERROR_MESSAGE_NOT_VALID_DATA_FORMAT,
} = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: ERROR_MESSAGE_NOT_VALID_DATA_FORMAT,
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: ERROR_MESSAGE_NOT_VALID_DATA_FORMAT,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: ERROR_MESSAGE_NOT_VALID_DATA_FORMAT,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

movieSchema.statics.checkMovieOwner = function (movieId, userId) {
  return this.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_FILM);
      }
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenError(ERROR_MESSAGE_FORBIDDEN);
      }
      return Promise.resolve(movie);
    });
};

movieSchema.statics.isMovieExistInUserList = function (movieId, userId) {
  return this.find({ owner: userId })
    .then((movies) => {
      if (movies) {
        const findedMovie = movies.find((movie) => movie.movieId === movieId);
        if (findedMovie) throw new ConflictError(ERROR_MESSAGE_CONFLICT_FILM_IN_USER_LIST);
        else Promise.resolve(false);
      }
      return Promise.resolve(false);
    });
};

module.exports = mongoose.model('movie', movieSchema);
