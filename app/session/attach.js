const Iron = require('@hapi/iron')
const { serverConfig } = require('../config')

const attach = async (request, session) => {
  request.yar.id = await Iron.unseal(session, serverConfig.cookiePassword, Iron.defaults)
  request.yar._store = await request.yar._cache.get(request.yar.id)
}

module.exports = {
  attach
}
