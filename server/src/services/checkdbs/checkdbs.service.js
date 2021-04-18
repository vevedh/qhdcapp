// Initializes the `checkdbs` service on path `/checkdbs`
const logger = require('../../logger')
const jetpack = require('fs-jetpack')


module.exports =  async function (app) {



  const checkMongoDB = (app) => {

    return new Promise((resolve, reject) => {


      app.get('mongoClient')
        .then((client) => {
          logger.info('Mongo Client connecté ! ') //, client)
          logger.info('Current Database : %s', app.get('currentDatabase'))
          //logger.info("DBO : %j ", client)

          client.listCollections().toArray((err, collectionInfos) => {
            if (err) {
              reject("Aucunes collections!!!")
            }
            logger.info("cols : %j", collectionInfos);

            if (collectionInfos.length == 0) {
              reject("No collections in database")
            } else {
              logger.info(`${collectionInfos.length} collections dans la base ${app.get('currentDatabase')}`)
              for (let index = 0; index < collectionInfos.length; index++) {
                const elt = collectionInfos[index];

              //}
              //collectionInfos.forEach((elt) => {
                logger.info('visite la collection : %j',elt)

                app.service('databases').find({
                  query: {
                    dbType: 'mongodb',
                    dbName: elt.name
                  }
                }).then((tables) => {
                  logger.info("Table %j:",tables)
                  var istable = tables;
                  if (istable.length == 0) {
                    app.service('databases').create({
                      dbType: 'mongodb',
                      dbName: elt.name,
                      createAt: new Date()
                    }).then((tableCreated) => {
                      logger.info("Table crée : %s", tableCreated)
                    }).catch(err => {
                      reject('table non crée')
                    })
                    // logger.info("Table mongo db existante trouvée  :", elt.name)
                  } else {
                    resolve(true)
                  }
                  resolve(true)
                }).catch(err => {
                  reject('table non trouvée')
                })


              }
              resolve(true)
            }


          })


        }).catch((err) => {
          reject()
        })




    })
  }

  logger.info("Check databases")
  //try {
  const mongoOk = await checkMongoDB(app)
  /*checkMongoDB(app).then((res)=>{
    logger.info("Result %j:",res)
    mongoOk = res;

  })*/
  //} catch (error) {
  //  logger.info('Traitement mongodb impossible')
  //}

if (mongoOk) {
      logger.info('MongoDb accessible !')
      app.set('mongodb_ok', true)
    } else {
      logger.info('MongoDb inaccessible !')
      app.set('mongodb_ok', false)
    }


  logger.info('Chemin des services : %s', __dirname)

  const nedbTables = jetpack.list(`${__dirname}/../../db-data/`)

  logger.info('Datadb sys nedb directory : %j', jetpack.list(`${__dirname}/../../db-data/`))

  if (nedbTables) {
    logger.info('Nedb tables')
    nedbTables.forEach(async (tbnedb) => {
      var isNedbTable = await app.service('databases').find({
        query: {
          dbType: 'nedb',
          dbName: tbnedb
        }
      }).catch(err => {
        logger.info('error database')
      })
      if (isNedbTable.length == 0) {
        await app.service('databases').create({
          dbType: 'nedb',
          dbName: tbnedb,
          createAt: new Date()
        }).catch(err => {
          logger.info('error database')
        })
        logger.info('Table nedb  existante trouvée  : %j', tbnedb)
      }
    })
  }
  // Initialize our service with any options it requires
  //app.use('/checkdbs', new Checkdbs(options, app));

  // Get our initialized service so that we can register hooks
  //const service = app.service('checkdbs');

  //service.hooks(hooks);
};
