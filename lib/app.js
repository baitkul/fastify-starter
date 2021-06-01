const Path = require('path')
const AutoLoad = require('fastify-autoload')
const Fp = require('fastify-plugin')

module.exports = Fp(registerApp)

async function registerApp (fastify, config) {
  fastify
    .register(AutoLoad, { options: config, dir: Path.join(__dirname, 'plugins') })
    .register(AutoLoad, { options: config, dir: Path.join(__dirname, 'routes') })
}
