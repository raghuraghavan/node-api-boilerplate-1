const express   = require('express');
const app       = express();
const api 		= require('./api');
const logger	= require(`${__dirUtil}/logger`);

// setup the app middlware
require('./middleware/appMiddlware')(app);

// setup the api
app.use('/api/', api);

// Error  Handler
app.use(function(err, req, res, next) {
  // if error thrown from jwt validation check
  if (err.name === 'UnauthorizedError') {
    res.send({ 'status': 0, 'error': 'Invalid token'});
    return;
  }

  logger.error(err.stack);

  res.send({ 'status': 0, 'error': 'Internal Server Error'});
});

// export the app for testing / web application
module.exports = app;