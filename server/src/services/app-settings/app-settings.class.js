const { Service } = require('feathers-mongodb')

exports.AppSettings = class AppSettings extends Service {
  constructor (options, app) {
    super(options)

    app.get('mongoClient').then(db => {
      this.Model = db.collection('app-settings')
    })
  }
}
