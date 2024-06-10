const Wreck = require('@hapi/wreck')
const jwkToPem = require('jwk-to-pem')
const { PUBLIC_KEY } = require('../../constants/cache-keys')
const { getWellKnown } = require('./get-well-known')
const { get: getCachedKey, set: setCachedKey } = require('../../cache')

const getKeys = async () => {
  const cachedKey = await getCachedKey(PUBLIC_KEY)
  if (cachedKey) {
    return { publicKey: cachedKey }
  }

  const { jwks_uri: url } = await getWellKnown()
  const { payload } = await Wreck.get(url, {
    json: true
  })

  const { keys } = payload
  const pem = jwkToPem(keys[0])

  await setCachedKey(PUBLIC_KEY, pem)

  return { publicKey: pem }
}

module.exports = {
  getKeys
}
