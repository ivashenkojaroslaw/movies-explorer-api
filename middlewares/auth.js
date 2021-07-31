require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const AuthorisationError = require('../errors/authorisation-error');
const { ERROR_MESSAGE_NEED_AUTHORISATION } = require('../utils/constants');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorisationError(ERROR_MESSAGE_NEED_AUTHORISATION);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw new AuthorisationError(ERROR_MESSAGE_NEED_AUTHORISATION);
  }

  req.user = payload;
  next();
};
