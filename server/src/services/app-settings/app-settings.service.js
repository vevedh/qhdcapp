// Initializes the `app-settings` service on path `/app-settings`
const { AppSettings } = require('./app-settings.class')
const hooks = require('./app-settings.hooks')

module.exports = function (app) {
  const options = {
    paginate: app.get('paginate')
  }

  // Initialize our service with any options it requires
  app.use('/app-settings', new AppSettings(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('app-settings')

  service.hooks(hooks)
}
