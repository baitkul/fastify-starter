const Pkg = require('../package.json')
const EnvSchema = require('env-schema')
const S = require('fluent-json-schema')

const env = EnvSchema({
  dotenv: true,
  schema: S.object()
    .prop('NODE_ENV', S.string().default('development'))
    .prop('APP_HOST', S.string().required())
    .prop('APP_PORT', S.number().required())
    .prop('APP_LOG_LEVEL', S.string().enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'))
    .prop('DEPLOYMENT_USER', S.string())
    .prop('DEPLOYMENT_HOST', S.string())
    .prop('DEPLOYMENT_REPOSITORY', S.string())
    .prop('DEPLOYMENT_REPOSITORY_BRANCH', S.string())
    .prop('DEPLOYMENT_PATH', S.string())
})

const isProduction = /^\s*production\s*$/.test(env.NODE_ENV)

const config = {
  isProduction,
  version: Pkg.version
}

config.server = {
  host: env.APP_HOST,
  port: env.APP_PORT
}

config.fastify = {
  ignoreTrailingSlash: true,
  caseSensitive: false,
  logger: {
    level: env.APP_LOG_LEVEL,
    prettyPrint: {
      colorize: true,
      levelFirst: true,
      ignore: 'hostname,time,pid'
    }
  }
}

config.swagger = {
  routePrefix: '/docs',
  exposeRoute: true,
  swagger: {
    info: {
      title: '',
      description: '',
      version: Pkg.version
    },
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header'
      }
    },
    security: [{ jwt: [] }]
  }
}

config.helmet = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", 'https:']
    }
  }
}

config.deployment = {
  user: env.DEPLOYMENT_USER,
  host: env.DEPLOYMENT_HOST,
  repository: env.DEPLOYMENT_REPOSITORY,
  repositoryBranch: env.DEPLOYMENT_REPOSITORY_BRANCH,
  path: env.DEPLOYMENT_PATH
}

if (!isProduction) {
  config.helmet = (instance) => {
    return {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'validator.swagger.io'],
          scriptSrc: ["'self'"].concat(instance.swaggerCSP.script),
          styleSrc: ["'self'", 'https:'].concat(instance.swaggerCSP.style)
        }
      }
    }
  }
}

if (isProduction) {
  config.fastify.logger.prettyPrint = false
  config.fastify.logger.prettifier = undefined
}

module.exports = config
