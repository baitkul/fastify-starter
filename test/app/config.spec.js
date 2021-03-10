const _ = require('lodash')
const test = require('ava')
const faker = require('faker')

test('app config should be set using env variables', async (t) => {
  const NODE_ENV = _.sample(['development', 'production'])
  const APP_HOST = faker.internet.ip()
  const APP_PORT = faker.random.number().toString()
  const APP_CORS_ORIGIN = 'oobamarket\\.kg$'
  const APP_MONGO_URL = 'mongodb://user:pass@127.0.0.1:27017'
  const APP_MONGO_DB_NAME = faker.lorem.word()
  const APP_JWT_SECRET = faker.random.uuid()
  const APP_LOG_LEVEL = _.sample(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
  const APP_DEFAULT_USER_USERNAME = faker.internet.userName()
  const APP_DEFAULT_USER_PASSWORD = faker.internet.password()
  const DEPLOYMENT_USER = faker.internet.userName()
  const DEPLOYMENT_HOST = faker.internet.ip()
  const DEPLOYMENT_REPOSITORY = faker.internet.url()
  const DEPLOYMENT_REPOSITORY_BRANCH = faker.git.branch()
  const DEPLOYMENT_PATH = faker.system.filePath()

  Object.assign(process.env, {
    NODE_ENV,
    APP_HOST,
    APP_PORT,
    APP_CORS_ORIGIN,
    APP_MONGO_URL,
    APP_MONGO_DB_NAME,
    APP_JWT_SECRET,
    APP_LOG_LEVEL,
    APP_DEFAULT_USER_USERNAME,
    APP_DEFAULT_USER_PASSWORD,
    DEPLOYMENT_USER,
    DEPLOYMENT_HOST,
    DEPLOYMENT_REPOSITORY,
    DEPLOYMENT_REPOSITORY_BRANCH,
    DEPLOYMENT_PATH
  })

  const config = require('../../lib/config')

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
    origin: new RegExp(APP_CORS_ORIGIN)
  })

  t.deepEqual(config.jwt, {
    secret: APP_JWT_SECRET
  })

  t.like(config.mongo, {
    url: APP_MONGO_URL,
    database: APP_MONGO_DB_NAME
  })

  t.deepEqual(config.defaultUser, {
    username: APP_DEFAULT_USER_USERNAME,
    password: APP_DEFAULT_USER_PASSWORD
  })

  t.deepEqual(config.deployment, {
    user: DEPLOYMENT_USER,
    host: DEPLOYMENT_HOST,
    repository: DEPLOYMENT_REPOSITORY,
    repositoryBranch: DEPLOYMENT_REPOSITORY_BRANCH,
    path: DEPLOYMENT_PATH
  })

  t.assert(typeof config.rateLimit === 'object' && config.rateLimit !== null)
})
