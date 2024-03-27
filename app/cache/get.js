const { getCache } = require('./get-cache')

const get = async (key) => {
  const cache = getCache()
  try {
    const cachedValue = await cache.get(key)
    return cachedValue
  } catch {
    console.log('Cache not yet available')
  }
}

module.exports = { get }
