const AutoLoad = require('fastify-autoload')
const Path = require('path')
const Cors = require('fastify-cors')
const Fp = require('fastify-plugin')
const Swagger = require('fastify-swagger')
const Sensible = require('fastify-sensible')
const Helmet = require('fastify-helmet')

module.exports = Fp(registerApp)

async function registerApp (fastify, config) {
  if (!config.isProduction) {
    fastify.register(Swagger, config.swagger)
  }

  fastify.register(Sensible)
  fastify.register(Helmet, config.helmet)
  fastify.register(Cors, config.cors)
  fastify.register(AutoLoad, {
    dir: Path.join(__dirname, 'plugins'),
    options: config
  })
  .register(AutoLoad, {
    dir: Path.join(__dirname, 'routes'),
    options: config
  })
}
