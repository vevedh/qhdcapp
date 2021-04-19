// Initializes the `authmanagement` service on path `/authmanagement`
const logger = require('../../logger')
const authManagement = require('feathers-authentication-management');
//const { Authmanagement } = require('./authmanagement.class');
const hooks = require('./authmanagement.hooks');
const notifier = require('./notifier');

module.exports = function (app) {

  // Initialize our service with any options it requires
  app.configure(authManagement(notifier(app)));

  logger.info("authManagement : %j",app.service('authManagement'))

  // Get our initialized service so that we can register hooks
  const service = app.service('authManagement');

  service.hooks(hooks);
};
