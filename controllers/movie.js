const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-error');
const DataRequestError = require('../errors/data-request-error');

const {
  ERROR_MESSAGE_FILM_DATA_REQUEST,
  ERROR_MESSAGE_NOT_FOUND_FILM,
} = require('../utils/constants');

module.exports.createMovie = (req, res, next) => {
  const {
    nameEN, nameRU, movieid, thumbnail, trailer, image,
    description, year, duration, director, country,
  } = req.body;
  const owner = req.user._id;
  return Movie.isMovieExistInUserList(movieid, owner)
    .then((isExist) => {
      if (!isExist) {
        Movie.create({
          nameEN,
          nameRU,
          movieid,
          thumbnail,
          trailer,
          image,
          description,
          year,
          duration,
          director,
          country,
          owner,
        })
          .then((movie) => { res.send({ data: movie }); });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new DataRequestError(ERROR_MESSAGE_FILM_DATA_REQUEST);
        next(error);
      } else {
        next(err);
      }
    });
};

module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

module.exports.removeMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;
  return Movie.checkMovieOwner(movieId, userId)
    .then((data) => Movie.findByIdAndRemove(data._id)
      .then(() => {
        res.status(200).send({ message: 'Фильм удален' });
      }))
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new NotFoundError(ERROR_MESSAGE_NOT_FOUND_FILM);
        next(error);
      } else {
        next(err);
      }
    });
};
