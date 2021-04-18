const { AuthenticationBaseStrategy, ConnectionEvent } = require('@feathersjs/authentication')
const logger = require('./logger')
const jetpack = require('fs-jetpack')
class LDAPStrategy extends AuthenticationBaseStrategy {

  checkLdap (data) {

    const clientLdap = require('ldapjs').createClient({
      url: this.configuration.url,
      reconnect: true,
      idleTimeout: 2592000,
      tlsOptions: { rejectUnauthorized: false }
    })

    // const arrBuf = this;

    return new Promise((resolve, reject) => {
      //console.log("Appel ldap :",this.configuration.searchBase.split(',')[0].split("=")[1]+"\\"+data.username, data.password);
      clientLdap.bind(this.configuration.searchBase.split(',')[0].split("=")[1]+"\\"+data.username, data.password, (err, res) => {
        if (err) {
          logger.info("Bind auth echec : %s",err);
          reject(err)
        }
        if (res) {
           logger.info("Auth ldapjs bind : %s",res);
          // resolve(res);
          if (clientLdap.connected) {
             //console.log("Search base:",this.configuration.searchBase);
            // console.log("Filtre :",this.configuration.searchFilter.replace(/{{username}}/g,data.username));
            clientLdap.search(this.configuration.searchBase, {
              filter: this.configuration.searchFilter.replace(/{{username}}/g, data.username),
              scope: 'sub'

            }, (err, res) => {
              if (err) {
                // console.log("Search echec :",err);

                 reject('Connexion impossible !')
              }
              if (res) {
                // console.log("Recherche :",res);
                const entries = []
                let thumbNail
                res.on('searchEntry', (entry) => {
                  // console.log("Entree :",entry.attributes);
                  entry.attributes.forEach((attr) => {
                    if (attr.type == 'thumbnailPhoto') {
                      //console.log('thumbnailPhoto :', attr._vals)
                      //console.log('Is Buffer :', Buffer.isBuffer(attr._vals[0]))

                      //console.log('Data buffer :', attr._vals[0].toString('base64'))

                      thumbNail = attr._vals[0].toString('base64')
                    }
                  })
                  var r = entry.object
                  if (!r.mail) {
                    r.mail = r.userPrincipalName
                  }
                  r.img64 = thumbNail
                  entries.push(r)

                  // console.log("Recherche :",entries);
                })
                res.on('error', (err) => {
                   reject(err)
                })
                res.on('end', (result) => {
                  clientLdap.destroy()
                  if (entries.length == 1) {
                    //console.log("AuthResult :",entries[0])
                    resolve(entries[0])
                  } else {
                    reject(false)
                  }
                })
              }
            })
          }
        }
      });
    });

    // var client = new Promise((resolve,reject) => {
  }

  verifyConfiguration () {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    ['url',  'searchBase', 'searchFilter'].forEach(prop => {
      if (typeof config[prop] !== 'string') {
        throw new Error(`'${this.name}' authentication strategy requires a '${prop}' setting`)
      }
    })

  }

  async authenticate (data, params) {

    return  new Promise((resolve, reject) => {
      const username = data.username
      const password = data.password

      logger.info('Auth :',username,password);

      // const auth = new LdapAuth(this.configuration);
      const name = this.name
      //const app = this.app
      const source = params.headers;
      console.log("Headers infos :",source)
      //const source = params.headers.host
      var userId

     // console.log('Config :',this.configuration);

      // new Promise((resolve, reject) => {
     this.checkLdap(data).then(async (user) => {
          console.log('Connection etablie')
          if (user) {
            //verifie qu'il exite un utilisateur local avec le meme mail que l'utilisateur ldap
            const waituser = await this.app.service('users').find({
              query: {
                email: user.mail
              }
            })
            //console.log('wait user :', waituser)
            // si il n'y a pas de correspondance locale
            if (waituser.total == 0) {
              if (!(user.mail) || (user.mail == '')) {
                user.mail = user.userPrincipalName
              }
              const createLocal = await this.app.service('users').create({
                email: user.mail,
                role: 'invite',
                password: password,
                user: user
              })
              //console.log('Création locale : ', createLocal)
              userId = createLocal._id
            } else {
              //console.log('Correspondance  locale : ', waituser)
              userId = waituser.data[0]._id
            }

            user._id = userId
            this.configuration.entity = user;
            //console.log("auh ok :",user)
            this.app.set('auth_strategy',name);

            resolve({
              authentication: { strategy: name },
              user
            })
          }
        }).catch((err) => {
          logger.info('Echec de connexion :', err)
          reject(err)

        })
      //});
    })
  }

}
exports.LDAPStrategy = LDAPStrategy
