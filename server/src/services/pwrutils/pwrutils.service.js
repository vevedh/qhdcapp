// Initializes the `lst-adfonctions` service on path `/lst-adfonctions`
const { PwrUtils } = require('./pwrutils.class')
const hooks = require('./pwrutils.hooks')

module.exports = function (app) {
  const options = {
    domain: app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, ''),
    paginate: false
  }

  // Initialize our service with any options it requires
  app.use('/pwrutils', new PwrUtils(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('pwrutils')

  service.hooks(hooks)
}
