const Config = require('./lib/config')

const main = async () => {
  process.on('unhandledRejection', err => {
    console.error(err)
    process.exit(1)
  })

  const server = require('fastify')(Config.fastify)

  server.register(require('./lib/app'), Config)

  await server.listen(Config.server)

  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
      server.close().then(err => {
        console.log(`close application on ${signal}`)
        process.exit(err ? 1 : 0)
      })
    )
  }
}

main()
