// Initializes the `usersInfos` service on path `/users-infos`
const { UsersInfos } = require('./users-infos.class');
const createModel = require('../../models/users-infos.model')
const hooks = require('./users-infos.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    multi:true,
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/usersInfos', new UsersInfos(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('usersInfos');

  service.hooks(hooks);
};
