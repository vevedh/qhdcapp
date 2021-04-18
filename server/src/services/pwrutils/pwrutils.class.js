/* eslint-disable no-unused-vars */
const logger = require('../../logger')

const npwrshell = require('powershell')

const runPowerShell = (cmd) => {


  return new Promise((resolve, reject) => {
    var psShell   = new npwrshell(`$OutputEncoding = [console]::InputEncoding = [console]::OutputEncoding = [System.Text.UTF8Encoding]::new(); ${cmd}`,{
      executionPolicy: 'Bypass',
      outputEncoding: 'utf-8',
      noProfile: true
    });

    psShell.on("error", err => {
      logger.info(err);
      reject(err);
    });

    // Stdout

    psShell.on("output", data => {
      logger.info(data);
      resolve(data);
    });

    // Stderr
    psShell.on("error-output", data => {
      logger.info(data);
      reject(data);
    });

    // End
    psShell.on("end", code => {
      // Do Something on end
      psShell = null;
    });
  });

}
// the ugly catch all
process.on('uncaughtException', (error) => {
  const { message, stack } = error
  console.log('error', error)
//	AppLogger.error({ error: { message, stack } });
})
exports.PwrUtils = class PwrUtils {
  constructor (options) {
    this.options = options || {}
  }

  async find (params) {

    // recuperation du nom de domaine
    const resdom = await runPowerShell('Get-WmiObject -Class Win32_ComputerSystem|select Domain|convertto-json')
    // logger.info(resdom)
    let currentDomain

    if (resdom && resdom.Domain) {
      logger.info('Le domaine est %s', resdom.Domain)
      currentDomain = resdom.Domain
    } else {
      currentDomain = this.app.get('authentication').ldap.searchBase.replace(',', '.').replace(/dc\=/ig, '')
    }

    let utilName = params.query.name;
    let utilParams = params.query.params;

    logger.info('Name = %j',utilName);
    logger.info('Params = %j',utilParams);

    let lstAccesUtils = ['Get-ChildOUStructure','Get-childItemTree'];
    let result = [];
    if (lstAccesUtils.includes(utilName)) {
      switch (utilName) {
        case 'Get-childItemTree':
            const treedir = await runPowerShell(`${__dirname}/../../../pwrshell/Get-childItemTree  -Path ${utilParams[0].path}`)
            result = (String(treedir).trim() != '') ? JSON.parse(treedir) : []
          break;
        case 'Get-ChildOUStructure':
            const treeous = await runPowerShell(`${__dirname}/../../../pwrshell/Get-ChildOUStructure.ps1`)
            result = (String(treeous).trim() != '') ? JSON.parse(treeous) : []
          break;

        default:
          break;
      }

      return result
    } else {
      return ['Non Possible']
    }


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

  setup (app, path) {
    this.app = app
    this.path = path
    this.params = app.params
  }


}
