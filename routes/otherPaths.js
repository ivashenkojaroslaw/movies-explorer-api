const router = require('express').Router();
const NotFoundError = require('../errors/not-found-error');
const { ERROR_MESSAGE_NOT_FOUND_URL } = require('../utils/constants');

router.use('/', () => {
  throw new NotFoundError(ERROR_MESSAGE_NOT_FOUND_URL);
});

module.exports = router;
