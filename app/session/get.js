const get = (request, key) => {
  return request.yar.get(key)
}

module.exports = {
  get
}
