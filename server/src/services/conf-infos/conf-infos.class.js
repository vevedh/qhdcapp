const jetpack = require('fs-jetpack')
const path = require('path')
/* eslint-disable no-unused-vars */
exports.ConfInfos = class ConfInfos {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {
    var conf = jetpack.read(path.resolve('./config/default.json'), 'utf8')
    // console.log("Config :",conf)

    return JSON.parse(conf)
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    }
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return data
  }

  async update (id, data, params) {
    return data
  }

  async patch (id, data, params) {
    return data
  }

  async remove (id, params) {
    return { id }
  }
}
