const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const {
  createMovie, getMovies, removeMovie,
} = require('../controllers/movie');

const {
  ERROR_MESSAGE_VALIDATE_REQUEST_IMAGE_FIELD,
  ERROR_MESSAGE_VALIDATE_REQUEST_TRAILER_FIELD,
  ERROR_MESSAGE_VALIDATE_REQUEST_THUMBNAIL_FIELD,
} = require('../utils/constants');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required().min(2).max(1000),
    image: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(ERROR_MESSAGE_VALIDATE_REQUEST_IMAGE_FIELD);
    }),
    trailer: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(ERROR_MESSAGE_VALIDATE_REQUEST_TRAILER_FIELD);
    }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message(ERROR_MESSAGE_VALIDATE_REQUEST_THUMBNAIL_FIELD);
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
}), removeMovie);

module.exports = router;
