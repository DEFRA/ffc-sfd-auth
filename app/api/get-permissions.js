const { base } = require('./base')

const getPermissions = async (request, organisationId, personId) => {
  const query = `
    query {
      permissions(organisationId: ${organisationId}, personId: ${personId}) {
        role,
        privileges
      }
    }
  `
  const response = await base(request, query)
  return response.permissions
}

module.exports = {
  getPermissions
}
