const Sensible = require('fastify-sensible')

module.exports = async function (app, _, done) {
  app.register(Sensible)
  done()
}
