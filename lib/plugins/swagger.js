const Swagger = require('fastify-swagger')

module.exports = async function (app, config, done) {
  if (!config.isProduction) {
    app.register(Swagger, config.swagger)
  }
  done()
}
