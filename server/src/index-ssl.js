const express = require('@feathersjs/express')
const feathers = require('@feathersjs/feathers')
const https = require('https');
const http = require('http');
const fs= require('fs');
const fsjetpack = require('fs-jetpack')

const { sso } = require('node-expose-sspi');

const logger = require('./logger');
const app = require('./app');
const appA = express(feathers())

const port = app.get('port');

if ((fsjetpack.exists(__dirname+'/your-private-key.pem') == 'file') && (fsjetpack.exists(__dirname+'/your-cert.pem') == 'file')) {

    const server = https.createServer({
      key: fs.readFileSync(__dirname+'/your-private-key.pem'),
      cert: fs.readFileSync(__dirname+'/your-cert.pem')
    }, app).listen(port);


    const unsecure = http.createServer(appA).listen(80);

    appA.set('port', 80);

    //  redirige toutes les requetes http (80) vers https (port)
    appA.get("*", (req, res, next) => {
        res.redirect("https://" + req.headers.host + ":"+port+"/" + req.path);
    });

    // initialise les serveurs
    app.setup(server);
    appA.setup(unsecure);

    process.on('unhandledRejection', (reason, p) =>
      logger.error('Unhandled Rejection at: Promise ', p, reason)
    );

    server.on('listening', () =>
      logger.info('Serveur web ssl démarré : https://%s:%d', app.get('host'), port)
    );

    unsecure.on('listening', () =>
      logger.info('Serveur web non-secure démarré : http://%s:%d', app.get('host'), 80)
    );
  } else {
    const unsecure = http.createServer(app).listen(port);
    app.setup(unsecure);
    unsecure.on('listening', () =>
      logger.info('Serveur web non-secure démarré : http://%s:%d', app.get('host'), port)
    );
  }


