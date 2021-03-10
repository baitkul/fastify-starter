const _ = require('lodash')
const test = require('ava')
const faker = require('faker')
const { getMongoUrl } = require('../utils')

test('server should be ready', async (t) => {
  Object.assign(process.env, {
    NODE_ENV: _.sample(['development', 'production']),
    APP_HOST: 'localhost',
    APP_PORT: 7777,
    APP_CORS_ORIGIN: 'oobamarket\\.kg$',
    APP_MONGO_URL: await getMongoUrl(),
    APP_MONGO_DB_NAME: faker.lorem.word(),
    APP_JWT_SECRET: faker.random.uuid(),
    APP_LOG_LEVEL: _.sample(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    APP_DEFAULT_USER_USERNAME: faker.internet.userName(),
    APP_DEFAULT_USER_PASSWORD: faker.internet.password(),
    DEPLOYMENT_USER: faker.internet.userName(),
    DEPLOYMENT_HOST: faker.internet.ip(),
    DEPLOYMENT_REPOSITORY: faker.internet.url(),
    DEPLOYMENT_REPOSITORY_BRANCH: faker.git.branch(),
    DEPLOYMENT_PAT: faker.system.filePath()
  })

  const config = require('../../lib/config')
  const server = require('fastify')(config.fastify)

  server.register(require('../../lib/app'), config)

  t.notThrows(async () => {
    await server.ready()
  })

  t.notThrows(async () => {
    await server.close()
  })
})
