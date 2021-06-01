const Helmet = require('fastify-helmet')

module.exports = async function (app, config, done) {
  app.register(Helmet, config.helmet)
  done()
}
