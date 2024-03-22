const exists = (request, key) => {
  return request.yar.get(key) ?? false
}

module.exports = {
  exists
}
