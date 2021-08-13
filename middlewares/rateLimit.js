const rateLimit = require('express-rate-limit');
const { ERROR_MESSAGE_TOO_MANY_REQUEST } = require('../utils/constants');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 300,
  message: ERROR_MESSAGE_TOO_MANY_REQUEST,
});

module.exports = {
  limiter,
};
