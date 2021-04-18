/* eslint-disable no-console */
const logger = require('./logger');
const https = require('https');
const http = require('http');
const app = require('./app');
const port = app.get('port');
const server = app.listen(port);
const privatekey = app.get('private_key');
const privateCert = app.get('private_cert');

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);
if (process.env.NODE_ENV == 'production') {

  if ((fsjetpack.exists(__dirname+'/'+privatekey) == 'file') && (fsjetpack.exists(__dirname+'/'+privateCert) == 'file')) {

    const server = https.createServer({
      key: fs.readFileSync(__dirname+`/${privatekey}`),
      cert: fs.readFileSync(__dirname+`/${privateCert}`)
    }, app).listen(port);

    // initialise les serveurs
    app.setup(server);

  }

  server.on('listening', () =>
  logger.info('Serveur web ssl démarré : https://%s:%d', app.get('host'), port)
);

} else {

  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  );
}

