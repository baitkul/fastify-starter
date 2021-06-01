const _ = require('lodash')
const test = require('ava')
const faker = require('faker')

test('app config should be set using env variables', async (t) => {
  const NODE_ENV = _.sample(['development', 'production'])
  const APP_HOST = faker.internet.ip()
  const APP_PORT = faker.datatype.number()
  const APP_LOG_LEVEL = _.sample(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
  const DEPLOYMENT_USER = faker.internet.userName()
  const DEPLOYMENT_HOST = faker.internet.ip()
  const DEPLOYMENT_REPOSITORY = faker.internet.url()
  const DEPLOYMENT_REPOSITORY_BRANCH = faker.git.branch()
  const DEPLOYMENT_PATH = faker.system.filePath()

  Object.assign(process.env, {
    NODE_ENV,
    APP_HOST,
    APP_PORT,
    APP_LOG_LEVEL,
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

  t.deepEqual(config.deployment, {
    user: DEPLOYMENT_USER,
    host: DEPLOYMENT_HOST,
    repository: DEPLOYMENT_REPOSITORY,
    repositoryBranch: DEPLOYMENT_REPOSITORY_BRANCH,
    path: DEPLOYMENT_PATH
  })
})
