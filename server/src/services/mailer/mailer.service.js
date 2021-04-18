// Initializes the `mailer` service on path `/mailer`
//const { Mailer } = require('./mailer.class');
const hooks = require('./mailer.hooks');
const Mailer = require('feathers-mailer');
const smtpTransport = require('nodemailer-smtp-transport');

module.exports = function (app) {
  app.use('/mailer', Mailer(smtpTransport({
    /*host: 'email-smtp.us-east-1.amazonaws.com',
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }*/
    host: app.get("smtp_server"),
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: app.get("smtp_user"), // compte expéditeur
      pass: app.get("smtp_password") // mot de passe du compte expéditeur
    },
          tls:{
        ciphers:'SSLv3'
    }
  })));

  const service = app.service('mailer');
  service.hooks(hooks);
};
