const Fastify = require('fastify')
const { Types } = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

exports.bootstrapApp = async () => {
  const app = Fastify({
    logger: {
      level: 'warn',
      prettyPrint: true
    }
  })

  app.register(require('fastify-sensible'))

  await app.after()

  return app
}

exports.ObjectId = Types.ObjectId

exports.Factory = require('./factory')

exports.getAuthHeaders = (app, user = {}) => {
  const data = {
    _id: exports.ObjectId(),
    username: 'username',
    fullname: 'fullname',
    role: 'ADMIN',
    ...user
  }

  const jwt = app.jwt.sign(data, { audience: 'private' })

  return { Authorization: `Bearer ${jwt}` }
}

exports.getMongoUrl = getMongoUrl

async function getMongoUrl () {
  const mongo = new MongoMemoryServer()
  return await mongo.getUri()
}
