const Wreck = require('@hapi/wreck')
const { authConfig } = require('../../config')
const { getWellKnown } = require('./get-well-known')

const refreshAccessToken = async (refreshToken) => {
  try {
    console.log('Refreshing access token')
    const { token_endpoint: url } = await getWellKnown()

    const query = [
    `client_id=${authConfig.clientId}`,
    `client_secret=${authConfig.clientSecret}`,
    'grant_type=refresh_token',
    `scope=openid offline_access ${authConfig.clientId}`,
    `refresh_token=${refreshToken}`,
    `redirect_uri=${authConfig.redirectUrl}`
    ].join('&')

    console.log('POST')
    console.log('application/x-www-form-urlencoded')
    console.log(`${url}?${query}`)

    const { payload } = await Wreck.post(`${url}?${query}`, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      json: true
    })

    console.log('Refreshed tokens')
    console.log(payload)

    return payload
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {
  refreshAccessToken
}
