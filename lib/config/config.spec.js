const _ = require('lodash')
const test = require('ava')
const faker = require('faker')

test('should set config according env variables', async (t) => {
  const NODE_ENV = _.sample(['development', 'test', 'production'])
  const APP_HOST = faker.internet.ip()
  const APP_PORT = faker.random.number().toString()
  const APP_CORS_ORIGIN = 'domain1.com domain2.com domain3.com'
  const APP_MONGO_URL = 'mongodb://user:pass@127.0.0.1:27017'
  const APP_MONGO_DB_NAME = faker.lorem.word()
  const APP_JWT_SECRET = faker.random.uuid()
  const APP_LOG_LEVEL = _.sample(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])

  Object.assign(process.env, {
    NODE_ENV,
    APP_HOST,
    APP_PORT,
    APP_CORS_ORIGIN,
    APP_MONGO_URL,
    APP_MONGO_DB_NAME,
    APP_JWT_SECRET,
    APP_LOG_LEVEL
  })

  const config = require('.')

  t.is(config.isProduction, NODE_ENV === 'production')

  t.deepEqual(config.server, {
    host: APP_HOST,
    port: APP_PORT
  })

  t.like(config.fastify, {
    logger: {
      level: APP_LOG_LEVEL
    }
  })

  t.deepEqual(config.cors, {
    origin: APP_CORS_ORIGIN.split(' ')
  })

  t.deepEqual(config.jwt, {
    secret: APP_JWT_SECRET
  })

  t.like(config.mongo, {
    url: APP_MONGO_URL,
    database: APP_MONGO_DB_NAME
  })
})
