const Pkg = require('../../package.json')
const EnvSchema = require('env-schema')
const S = require('fluent-json-schema')

const env = EnvSchema({
  dotenv: true,
  schema: S.object()
    .prop('NODE_ENV', S.string().default('development'))
    .prop('APP_HOST', S.string().default('127.0.0.1'))
    .prop('APP_PORT', S.string().default('8888'))
    .prop('APP_CORS_ORIGIN', S.string().default('*'))
    .prop('APP_MONGO_URL', S.string())
    .prop('APP_MONGO_DB_NAME', S.string())
    .prop('APP_JWT_SECRET', S.string().default('4574e2bf-d301-4e20-86be-0945eebe94b4'))
    .prop('APP_LOG_LEVEL', S.string().enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'))
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

config.cors = {
  origin: env.APP_CORS_ORIGIN.split(' ')
}

config.jwt = {
  secret: env.APP_JWT_SECRET
}

config.mongo = {
  forceClose: true,
  url: env.APP_MONGO_URL,
  database: env.APP_MONGO_DB_NAME
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
