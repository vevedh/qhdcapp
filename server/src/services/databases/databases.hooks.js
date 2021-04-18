const { authenticate } = require('@feathersjs/authentication').hooks

const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks

const populateDB = async (context) => {
  const { app, method, result, params } = context

  // console.log("Database datas :",context)

  if (!context.visible) {
    context.visible = true
  }

  return context
}

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [populateDB, authenticate('jwt')],
    update: [populateDB, authenticate('jwt')],
    patch: [],
    remove: [authenticate('jwt')]
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
}
