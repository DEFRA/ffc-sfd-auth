const { USER, SFD_VIEW, ORGANISATION_AMEND, ORGANISATION_VIEW, AHWP_AMEND, AHWP_SUBMIT, AHWP_VIEW } = require('../scopes')
const { setSession } = require('../../session')
const { ROLE, SCOPES } = require('../../constants/cache-keys')

const setPermissions = (request, organisationId) => {
  setSession(request, ROLE, 'Key contact')
  setSession(request, SCOPES, [USER, SFD_VIEW, ORGANISATION_AMEND, ORGANISATION_VIEW, AHWP_AMEND, AHWP_SUBMIT, AHWP_VIEW])
}

module.exports = {
  setPermissions
}
