const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');

const serverError = require('./middlewares/serverError');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimit');

const { NODE_ENV, DATA_BASE_URL } = process.env;
const { config } = require('./utils/config');

const { PORT = 3000 } = process.env;

const app = express();

app.use(requestLogger);

app.use(limiter);
app.use(cors);
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(NODE_ENV === 'production' ? DATA_BASE_URL : `${config.database.type}://${config.database.host}:${config.database.port}/${config.database.db}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

require('./routes/index')(app);

app.use(errorLogger);

app.use(errors());

app.use(serverError);

app.listen(PORT);
