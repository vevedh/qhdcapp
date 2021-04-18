// src/store/index.js
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { store as wrapper } from 'quasar/wrappers'
import { FeathersVuex, makeAuthPlugin } from '../boot/feathers-client'

import users from './services/users'
import tables from './services/tables'
import ConfInfos from './services/conf-infos'
//import adinfos from './adinfos'
//import teamviewer from './teamviewer'
//import adminModule from './admin'
//import vvstore from './vvstore'



Vue.use(Vuex)
Vue.use(FeathersVuex)

/*
export interface StateInterface {
  admin: unknown;
  bases: unknown;
}*/


export default wrapper(function ({ Vue }) {
  Vue.use(Vuex)

  const store = new Store<any>({


    modules: {
      //vvstore,
      //adinfos,
      //teamviewer,
      //adminModule
    },
    plugins: [

      users,
      tables,
      ConfInfos,
      makeAuthPlugin({ userService: 'users'})
    ],

    strict: !!process.env.DEBUGGING
  })

 // this line does all the magic
 //getModule(bases store)
  return store
})


