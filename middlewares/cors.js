const allowedCors = [
  'http://diplom.front.nomoredomains.club',
  'https://diplom.front.nomoredomains.club',
  'http://www.diplom.front.nomoredomains.club',
  'https://www.diplom.front.nomoredomains.club',
  'http://localhost:3001',
];
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Creadentials', true);
    if (method === 'OPTIONS') {
      res.header('Access-Control-Allow-Headers', requestHeaders);
      res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
      res.status(204).send();
    } else next();
  } else next();
};
