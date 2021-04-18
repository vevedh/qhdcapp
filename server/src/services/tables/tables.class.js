const NeDB = require('nedb')
const path = require('path')
const logger = require('../../logger')

exports.Tables = class DynamicService {
  setup (app, path) {
    this.app = app
    this.path = path
    // this.prj_mongodb_cnx = app.get('mongodb_cnx');
    // this.prj_mongodb_name = app.get('mongodb_name');
    this.params = app.params
  }

  async find (params) {
    // console.log("Params :",params)
    // await this.checkMongoDB();

    if (params.query.tableDb && params.query.tableName) {
      if (String(params.query.tableName).indexOf('?') != -1) {
        const tableName = String(params.query.tableName).split('?')[0]
        const paramsVals = String(params.query.tableName).split('?')[1]
        console.log('Search =', Object.fromEntries(new URLSearchParams(paramsVals)))
        // const { query } = this.filterQuery(paramsVals);

        return this.getService(params.query.tableDb, tableName).find({ query: Object.fromEntries(new URLSearchParams(paramsVals)) })
      } else if (params.query.query) {
        return this.getService(params.query.tableDb, params.query.tableName).find(JSON.parse(params.query.query))// { query : JSON.parse(params.query.query) }
      } else {
        return this.getService(params.query.tableDb, params.query.tableName).find({})
      }
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Model not found' })
    }
  }

  async get (id, params) {
    if (params.query.tableDb && params.query.tableName) {
      return this.getService(params.query.tableDb, params.query.tableName).get(id, params)
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' })
    }
  }

  async create (data, params) {
    if (params.query.tableDb && params.query.tableName) {
      console.log('create table ', params.query.tableName)

      const dbFind = await this.app.service('databases').find({
        query: {
          dbName: params.query.tableName,
          dbType: params.query.tableDb
        }
      })

      if (dbFind && (dbFind.length != 0)) {
        console.log('Dbfind :', dbFind)
        console.log('Cette table existe déjà malheureusement !')
        return this.getService(params.query.tableDb, params.query.tableName).create(data, params)
        // throw new Error(`Il y a déjà 1 table avec ce nom ${params.query.tableName} et type ${params.query.tableDb} !`);
      } else {
        console.log(`Creation possible de la table ${params.query.tableName} `)

        const dbCreate = await this.app.service('databases').create({
          dbType: params.query.tableDb,
          dbName: params.query.tableName,
          createAt: new Date()
        })

        if (dbCreate) {
          console.log(`Creation de la table  ${params.query.tableName} effectuée `)
        }

        return this.getService(params.query.tableDb, params.query.tableName).create(data, params)
      }
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' })
    }
  }

  async update (id, data, params) {
    if (params.query.tableDb && params.query.tableName) {
      return this.getService(params.query.tableDb, params.query.tableName).update(id, data, params.query.params)
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' })
    }
  }

  async patch (id, data, params) {
    if (params.query.tableDb && params.query.tableName) {
      return this.getService(params.query.tableDb, params.query.tableName).patch(id, data, params)
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' })
    }
  }

  async remove (id, params) {
    if (params.query.tableDb && params.query.tableName) {
      return this.getService(params.query.tableDb, params.query.tableName).remove(id, params.query.params)
    } else {
      throw new errors.BadRequest('Not Found', { message: 'Table not found' })
    }
  }

  getService (db, name) {
    console.log('Type Table :', db)
    console.log('Table name :', name)

    if (String(name).indexOf('?') != -1) {
      name = String(name).split('?')[0]
    }

    if (!this.app.service(`${name}`)) {
      //  creation du service selon type de base de donnée
      switch (db) {
        case 'nedb':
          //  database  adapter
          const {
            Service
          } = require('feathers-nedb')

          console.log('Service NEDB table :', name, __dirname)
          // Modele + service
          this.app.use(
              `/${name}`,
              new Service({
                Model: new NeDB({
                  filename: `${__dirname}/../../../db-data/${name}`, // `./db-data/${name}`,//path.resolve(process.cwd() + "/db-data/" + name),
                  autoload: true
                }),
                paginate: false,
                multi: true
              })
          )

          break
        case 'mongodb':

          //  database  adapter
          const ServiceMongo = require('feathers-mongodb')

          class mongoService extends ServiceMongo {
            constructor (options, app) {
              super(options)

              app.get('mongoClient').then(db => {
                this.Model = db.collection(name)
              })
            }
          };
          // lister les collection existantes
          // et verifier si elles exites dans databases ( tables utilisables )

          const options = {
            // Model: createModel(app),
            paginate: false, // app.get('paginate')
            multi: true
          }

          // Initialize our service with any options it requires
          this.app.use(`/${name}`, new mongoService(options, this.app))
          //
          break

        default:
          /* const {
              Service
            } = require("feathers-nedb"); */
          console.log('Service NEDB table sys :', name)

          this.app.use(
              `/${name}`,
              new Service({
                Model: new NeDB({
                  filename: `${__dirname}/../../../db-sys-data/${name}`, // path.resolve(process.cwd() + "server/db-sys-data/" + name),//,//path.resolve(process.cwd() + "/db-sys-data/" + name),
                  autoload: true
                }),
                paginate: false,
                multi: true
              })
          )

          this.app.service(`${name}`)
          break
      }
    }

    return this.app.service(`${name}`)
  }
}
