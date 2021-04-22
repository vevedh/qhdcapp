const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback')

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongodb = require('./mongodb');

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//app.use(history())
/**{
  disableDotRule: true,
  verbose: true
} */
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder




// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongodb);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);


var options = {
  dotfiles: 'ignore',
  //etag: false,
  //extensions: ['htm', 'html'],
  index: false,
  //maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}

app.use('/', express.static(app.get('public'),options));
logger.info("Web 1 : %s",process.cwd() + app.get('public') )

app.use('/mysite', express.static(process.cwd() + '/projets/www/',options));
logger.info("Web 2 : %s",process.cwd() + '/projets/www/' )


app.use(history())
/**{
  index: './',
  disableDotRule: true,
  rewrites:[{
    from: /./i,
    to: function (context) {
      return context.parsedUrl + '/';
  }
}],
logger: console.log.bind(console)
} */


app.use('/', express.static(app.get('public')));
logger.info("Web 1 : %s",process.cwd() + app.get('public') )

app.use('/mysite', express.static(process.cwd() + '/projets/www/'));
logger.info("Web 2 : %s",process.cwd() + '/projets/www/' )



// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
