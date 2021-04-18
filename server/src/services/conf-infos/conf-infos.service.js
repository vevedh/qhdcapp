// Initializes the `confInfos` service on path `/conf-infos`
const { ConfInfos } = require('./conf-infos.class')
const hooks = require('./conf-infos.hooks')

module.exports = function (app) {
  const options = {
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/conf-infos', new ConfInfos(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('conf-infos')

  service.hooks(hooks)
}
