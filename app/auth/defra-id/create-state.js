const { v4: uuidv4 } = require('uuid')
const { STATE } = require('../../constants/cache-keys')

const createState = (request, redirect) => {
  const state = Buffer.from(JSON.stringify({
    id: uuidv4(),
    redirect,
    organisationId: request.query?.organisationId
  })).toString('base64')

  request.yar.set(STATE, state)

  return state
}

module.exports = {
  createState
}
