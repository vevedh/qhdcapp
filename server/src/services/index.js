const users = require('./users/users.service.js');
const mailer = require('./mailer/mailer.service.js');
const authmanagement = require('./authmanagement/authmanagement.service.js');
const databases = require('./databases/databases.service.js')
const checkdbs = require('./checkdbs/checkdbs.service.js');
const tables = require('./tables/tables.service.js');


// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(mailer);
  app.configure(authmanagement);

  app.configure(databases);
  app.configure(checkdbs);
  app.configure(tables);
};
