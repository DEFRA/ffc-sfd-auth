const Wreck = require('@hapi/wreck')
const { authConfig } = require('../../config')
const { WELL_KNOWN } = require('../../constants/cache-keys')
const { get: getCachedKey, set: setCachedKey } = require('../../cache')

const getWellKnown = async () => {
  const cachedWellKnown = await getCachedKey(WELL_KNOWN)
  if (cachedWellKnown) {
    return cachedWellKnown
  }
  const { payload } = await Wreck.get(authConfig.wellKnownUrl, {
    json: true
  })

  await setCachedKey(WELL_KNOWN, payload)

  return payload
}

module.exports = {
  getWellKnown
}
