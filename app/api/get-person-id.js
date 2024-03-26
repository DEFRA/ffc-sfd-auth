const { base } = require('./base')

const getPersonId = async (request) => {
  const query = `
    query {
      person {
        id
      }
    }
  `
  const response = await base(request, query)
  return response.person.id
}

module.exports = {
  getPersonId
}
