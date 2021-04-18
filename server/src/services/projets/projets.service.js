// Initializes the `projets` service on path `/projets`
const { Projets } = require('./projets.class');
const createModel = require('../../models/projets.model');
const hooks = require('./projets.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/projets', new Projets(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('projets');

  service.hooks(hooks);
};
