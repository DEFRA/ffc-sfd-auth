const { cacheConfig } = require('../config')
const { getCache } = require('./get-cache')

const set = async (key, value) => {
  const cache = getCache()
  try {
    await cache.set(key, value, cacheConfig.ttl)
  } catch {
    console.log('Cache not yet available')
  }
}

module.exports = { set }
