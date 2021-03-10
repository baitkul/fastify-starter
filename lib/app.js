const AutoLoad = require('fastify-autoload')
const Path = require('path')
const Cors = require('fastify-cors')
const Fp = require('fastify-plugin')
const Swagger = require('fastify-swagger')
const Sensible = require('fastify-sensible')
const Helmet = require('fastify-helmet')
const RateLimit = require('fastify-rate-limit')

module.exports = Fp(registerApp)

async function registerApp (fastify, config) {
  if (!config.isProduction) {
    fastify.register(Swagger, config.swagger)
  }

  fastify
    .register(Sensible)
    .register(Helmet, config.helmet)
    .register(Cors, config.cors)
    .register(RateLimit, config.rateLimit)
    .register(AutoLoad, {
      dir: Path.join(__dirname, 'plugins'),
      options: config
    })
    .register(AutoLoad, {
      dir: Path.join(__dirname, 'routes'),
      options: config
    })
}
