const Fastify = require('fastify')

exports.bootstrapApp = async () => {
  const app = Fastify({
    logger: {
      level: 'warn',
      prettyPrint: true
    }
  })

  return app
}
