const { SCOPES } = require('../constants/cache-keys')
const { getSession } = require('../session')

const getScopes = (request) => {
  const scopes = getSession(request, SCOPES)
  return scopes ?? []
}

module.exports = {
  getScopes
}
