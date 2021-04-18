const { Tables } = require('./tables.class')
const hooks = require('./tables.hooks')

module.exports = function (app) {
  const service = app.use('/tables', new Tables())

  service.hooks(hooks)
}
