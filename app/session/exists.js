const exists = (request, key) => {
  return request.yar.get(key) !== undefined
}

module.exports = {
  exists
}
