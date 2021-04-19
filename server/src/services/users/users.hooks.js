const logger = require('../../logger')
const { authenticate } = require('@feathersjs/authentication').hooks;

const {  disallow, iff, isProvider, preventChanges  } = require('feathers-hooks-common');
const verifyHooks = require('feathers-authentication-management').hooks;
const accountService = require('../authmanagement/notifier');

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;



// We need this to create the MD5 hash
const crypto = require('crypto');

// The Gravatar image service
const gravatarUrl = 'https://s.gravatar.com/avatar';
// The size query. Our chat needs 60px images
const query = 's=60';
// Returns the Gravatar image for an email
const getGravatar = email => {
  // Gravatar uses MD5 hashes from an email address (all lowercase) to get the image
  const hash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  // Return the full avatar URL
  return `${gravatarUrl}/${hash}?${query}`;
};


// transformer les données utilisateur Ad avant mémorisation
// valable pour d'autres transformations
const arrayBufferToBase64 = (buffer) => {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

const populateUser = async (context) => {

  const { app, method, result, params } = context;

  console.log('method :',context.method);
  console.log('data :',context.data);


  context.data.gravatar = (context.data.email) ? getGravatar(context.data.email) : '';


  //if (context)

  if (!context.data.role) {
    context.data.role = 'invite';
  }

  if (!context.data.createAt) {
    context.data.createAt = new Date();
  }



  return context
}

const updateUser = async (context) => {

  const { app, method, result, params } = context;

  console.log('method :',context.method);
  console.log('data :',context.data);


  context.data.gravatar = (context.data.email) ? getGravatar(context.data.email) : '';

  if (!context.data.createAt) {
    context.data.createAt = new Date();
  }

  if (!context.data.updateAt) {
    context.data.updateAt = new Date();
  }
  context.data.updateAt = new Date();


  return context
}

const modUsersDatas = async (context) => {

  context.data.picBase64 = (context.data.ThumbnailPhoto != null) ? "data:image/jpeg;base64," + arrayBufferToBase64(context.data.ThumbnailPhoto).toString() : '';


  if (context.data.picBase64 == '') {
    // definir un avatar
    context.data.picBase64 = (context.data.mail) ? getGravatar(context.data.mail) : '';
  }

  return context;
};

const addUsersState = async (context) => {
  context.data.state = 'offline';
  return context;
};






const checkDB = async (context) => {


  const { app, method, result, params } = context;

  await checkMongoDB(app)

  return context
}


const checkReg = async (context) => {


  const { app, method, result, params } = context;


        if (context.params.query.email) {
          context.params.query.email.$regex = new RegExp(context.params.query.email.$regex, 'igm');
        }

  return context
}


const checkIsUnique = async (context) => {




  //logger.info("Check is result : %j",result)
  //logger.info("Check is params : %j",params)
  logger.info("Check is data : %j",context.data)
  let results = await context.app.service('users').find({ query: { email: context.data.email}});
  logger.info("result : %j",results)
  if (results.data.length >= 1) {
    logger.info(`Ce compte ${context.data.email} existe déjà`)
    throw new Error(`Ce compte ${context.data.email} existe déjà`);
  }
  //accountService(context.app).checkIsUnique()
  //accountService(context.app).notifier('resendVerifySignup', context.result)
  /*

  context => {
        accountService(context.app).notifier('resendVerifySignup', context.result)
      },
      */

  return context
}



module.exports = {
  before: {
    all: [],
    find: [ authenticate('jwt') ],
    get: [ authenticate('jwt') ],
    create: [

      hashPassword('password'),
      checkIsUnique,
      verifyHooks.addVerification()
    ],
    update: [ disallow('external') ],//hashPassword('password'),  authenticate('jwt')
    patch: [
        iff(
        isProvider('external'),
        preventChanges(true,
          'email',
          'isVerified',
          'verifyToken',
          'verifyShortToken',
          'verifyExpires',
          'verifyChanges',
          'resetToken',
          'resetShortToken',
          'resetExpires'
        ),
        hashPassword('password'),
        authenticate('jwt')
      ) ],//hashPassword('password'),  authenticate('jwt')
    remove: [ authenticate('jwt') ]
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [
      context => {
        accountService(context.app).notifier('resendVerifySignup', context.result)
      },
      verifyHooks.removeVerification()
    ],
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
};
