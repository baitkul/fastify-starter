const _ = require('lodash')
const test = require('ava')
const faker = require('faker')

test('server should be ready', async (t) => {
  Object.assign(process.env, {
    NODE_ENV: _.sample(['development', 'production']),
    APP_HOST: 'localhost',
    APP_PORT: 7777,
    APP_LOG_LEVEL: _.sample(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    DEPLOYMENT_USER: faker.internet.userName(),
    DEPLOYMENT_HOST: faker.internet.ip(),
    DEPLOYMENT_REPOSITORY: faker.internet.url(),
    DEPLOYMENT_REPOSITORY_BRANCH: faker.git.branch(),
    DEPLOYMENT_PATH: faker.system.filePath()
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
