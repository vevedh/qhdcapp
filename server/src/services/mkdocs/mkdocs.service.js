// Initializes the `mkdocs` service on path `/mkdocs`
const { Mkdocs } = require('./mkdocs.class');
const hooks = require('./mkdocs.hooks');

module.exports = function (app) {
  const options = {
    paginate: false
  };

  // Initialize our service with any options it requires
  app.use('/mkdocs', new Mkdocs(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('mkdocs');

  service.hooks(hooks);
};
