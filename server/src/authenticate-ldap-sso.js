const {
  AuthenticationBaseStrategy,
  ConnectionEvent
} = require('@feathersjs/authentication')
const logger = require('./logger')
const jetpack = require('fs-jetpack');

class LDAPSsoStrategy extends AuthenticationBaseStrategy {

  async getUserData(ssodata) {
    let obj = new Object();
    for (const key in ssodata) {
      if (Object.hasOwnProperty.call(ssodata, key)) {

        const element = ssodata[key];
        if (key != 'memberOf') {
          obj[key] = element[0];
        } else {
          obj[key] = element;
        }

      }
    }
    return obj;
  }

  verifyConfiguration() {
    const config = this.configuration; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);

  }

  async authenticate(data, params) {

    const name = this.name
    const config = this.configuration; //'bindDN', 'bindCredentials'
    //console.log('SSO Config :',config);
    //console.log("Auth SSo :",data,params)

    var userId = data.sso.sso.name;
    //console.log("Auth userid :",userId)
    //console.log("Auth adUser :",data.sso.sso.adUser)
    var user = await this.getUserData(data.sso.sso.adUser);
    //console.log("Auth adUser user :",user)
    if (user) {
      if (!(user.mail) || (user.mail == '')) {
        user.mail = user.sAMAccountName
      }
      //verifie qu'il exite un utilisateur local avec le meme mail que l'utilisateur ldap
      const waituser = await this.app.service('users').find({
        query: {
          email: user.mail
        }
      })
      //console.log('wait user :', waituser)
      // si il n'y a pas de correspondance locale
      if (waituser.total == 0) {

        const createLocal = await this.app.service('users').create({
          email: user.mail,
          role: 'invite',
          user: user
        })
        //console.log('Création locale : ', createLocal)
        userId = createLocal._id
      } else {
        //console.log('Correspondance  locale : ', waituser)
        userId = waituser.data[0]._id
      }

      user._id = userId
      //console.log("Auth sso user :",user)
    }

    return {
      authentication: {
        strategy: name
      },
      user
    }

  }

}
exports.LDAPSsoStrategy = LDAPSsoStrategy
