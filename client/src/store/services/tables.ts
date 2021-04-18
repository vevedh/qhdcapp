import feathersClient, { makeServicePlugin, BaseModel } from '../../boot/feathers-client'

class Table extends BaseModel {
  constructor(data: any, options: any) {
    options.pagination =  null
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Table';

  // Define default properties here
  static instanceDefaults () {
    return {}
  }
}
const servicePath = 'tables'
const servicePlugin = makeServicePlugin({
  Model: Table,
  service: feathersClient.service(servicePath),
  servicePath,
  extend({ store, module }) {
    // Listen to other parts of the store
    //store.watch(/* truncated */)

    return {
      state: {

          actualites:[{
            _id: '',
            description: 'test',
            rubriques: [],
            titre: 'NOS ACTUALITES',
            type: 'actualite'
          }]

      },
      getters: {
        listActus(state:any) {
          return state.actualites[0]
        }
      },
      mutations: {
        setAllActus(state: any,context: any) {
          console.log("Test setAllActus :",context)
          state.actualites = context

        }
      },
      actions: {
        getAllActus(context: any,_payload:[]) {
          feathersClient.service(servicePath).find({
            query:{
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          }).then((datas:any)=>{
            context.commit('setAllActus',datas);
          })
        },
        async updateRubriqueActusById(context:any ,payload:any[]) {
          let idRubrique = payload[0];
          let newRubrique = payload[1];
          let actualites = await feathersClient.service(servicePath).find({
            query:{
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          })

          actualites[0].rubriques[idRubrique] = newRubrique
          await feathersClient.service(servicePath).update(actualites[0]._id,actualites[0],{
            query:{
              tableDb: 'mongodb',
              tableName: 'dbHomeSections'
            }
          })
          context.commit('setAllActus',actualites);
          //console.log("Context details :",context)

        },
        async addRubriqueActus(context:any ,payload:any[]) {

          let newRubrique = payload[0];
          let actualites = await feathersClient.service(servicePath).find({
            query:{
              tableDb: 'mongodb',
              tableName: 'dbHomeSections',
              query: JSON.stringify({ query: { type: 'actualite' } })
            }
          })

          actualites[0].rubriques.push(newRubrique)
          await feathersClient.service(servicePath).update(actualites[0]._id,actualites[0],{
            query:{
              tableDb: 'mongodb',
              tableName: 'dbHomeSections'
            }
          })
          context.commit('setAllActus',actualites);
          //console.log("Context details :",context)

        }
      }
    }
  }
})


const checkQuery = async (context:any) => {


  const { app, method, result, params  } = context;


  console.log("Query table ",context);

  //params.query.query = JSON.stringify(params.query.query)


  return context
}

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
})

export default servicePlugin
