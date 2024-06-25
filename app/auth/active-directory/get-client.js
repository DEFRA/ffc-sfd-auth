const msal = require('@azure/msal-node')
const { authConfig } = require('../../config')

let client

const getClient = () => {
  if (!client) {
    client = new msal.ConfidentialClientApplication({
      auth: authConfig.activeDirectory
    })
  }
  return client
}

module.exports = {
  getClient
}
