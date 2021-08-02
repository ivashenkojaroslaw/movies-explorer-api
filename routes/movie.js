const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createMovie, getMovies, removeMovie,
} = require('../controllers/movie');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required().min(2).max(1000),
    image: Joi.string().required().regex(/(https?:\/\/)([\da-z-]+)\.([a-z]{2,6})([\/\w.-]*)*(#\/)?$/mi), // eslint-disable-line
    trailer: Joi.string().required().regex(/(https?:\/\/)([\da-z-]+)\.([a-z]{2,6})([\/\w.-]*)*(#\/)?$/mi), // eslint-disable-line
    thumbnail: Joi.string().required().regex(/(https?:\/\/)([\da-z-]+)\.([a-z]{2,6})([\/\w.-]*)*(#\/)?$/mi), // eslint-disable-line
    movieid: Joi.number(),
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
