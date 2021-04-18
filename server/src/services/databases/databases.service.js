// Initializes the `databases` service on path `/databases`
const { Databases } = require('./databases.class')
const createModel = require('../../models/databases.model')
const hooks = require('./databases.hooks')

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: false, // app.get('paginate')
    multi: true
  }

  // Initialize our service with any options it requires
  app.use('/databases', new Databases(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('databases')

  service.hooks(hooks)
}
