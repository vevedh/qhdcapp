
const logger = require('./logger')
const MongoClient = require('mongodb').MongoClient

module.exports = function (app) {
  const connection = app.get('mongodb')
  logger.info('Database cnx string : ' + connection)
  const database = connection.substr(connection.lastIndexOf('/') + 1).replace('?authSource=admin', '')
  logger.info('Database : ' + database)


  const mongoClient = MongoClient.connect(app.get('mongodb'), { useNewUrlParser: true, useUnifiedTopology: true  })
    .then((client) => {
      //const dbAdmin = client.db().admin()
      //app.set('dbAdmin', dbAdmin)
      app.set('currentDatabase', database)
      app.set('mongodb_ok',true)
      return client.db(database)
    }).catch((err) => {
      logger.info("Erreur access mongodb :%j",err)
      app.set('mongodb_ok',false)
      logger.info("Votre base de donnée Mongodb n'est pas accessible ou est non configurée!")
      logger.info(`Dans le fichier de configuration vous devez avoir une chaine de connexion accessible!\n
      Exemple de configuration:

        "mongodb": "mongodb://localhost:27017/database?authSource=admin"\n `)
    })

  app.set('mongoClient', mongoClient)
}
