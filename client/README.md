# HDCApp (hdcapp)

HDCApp Application MultiServices




### Prérequis pour utiliser FeathersVuex
```
npm i @feathersjs/feathers @feathersjs/socketio-client @feathersjs/authentication-client socket.io-client@2.3.0 @vue/composition-api feathers-vuex feathers-hooks-common --save
```




### Create file **store/store.auth.ts**
```
import { makeAuthPlugin } from '../boot/feathers-client'

export default makeAuthPlugin({ userService: 'users'})
```

### Create file **store/index.ts**
```
// src/store/index.js
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { store as wrapper } from 'quasar/wrappers'
import { FeathersVuex, makeAuthPlugin } from '../boot/feathers-client'

import users from './services/users'
import tables from './services/tables'
import ConfInfos from './services/conf-infos'
import adinfos from './adinfos'
import teamviewer from './teamviewer'
import adminModule from './admin'
import vvstore from './vvstore'



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
      adinfos,
      teamviewer,
      adminModule
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
```


## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
npm run lint
```

### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://v1.quasar.dev/quasar-cli/quasar-conf-js).
