const {
  USER,
  SFD_VIEW,
  ORGANISATION_AMEND,
  ORGANISATION_VIEW,
  AHWP_SUBMIT,
  AHWP_AMEND,
  AHWP_VIEW
} = require('../scopes')

const {
  BUSINESS_AMEND,
  BPS_SUBMIT
} = require('../privileges')

const mapScopes = (privileges) => {
  const scopes = [USER, SFD_VIEW]
  if (privileges.includes(BUSINESS_AMEND)) {
    scopes.push(ORGANISATION_AMEND)
    scopes.push(ORGANISATION_VIEW)
    scopes.push(AHWP_SUBMIT)
    scopes.push(AHWP_AMEND)
    scopes.push(AHWP_VIEW)
  }
  if (privileges.includes(BPS_SUBMIT)) {
    scopes.push(AHWP_SUBMIT)
    scopes.push(AHWP_AMEND)
    scopes.push(AHWP_VIEW)
  }
  return [...new Set(scopes)]
}

module.exports = {
  mapScopes
}
