const get = (request, key) => {
  if (request.yar._store) {
    return request.yar.get(key)
  }
}

module.exports = {
  get
}
