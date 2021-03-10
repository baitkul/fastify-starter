const Config = require('./lib/config')
const Pkg = require('./package.json')

module.exports = {
  apps: [{
    name: Pkg.name,
    max_memory_restart: '512M',
    exec_mode: 'fork',
    script: './index.js',
    env_production: {
      NODE_ENV: 'production'
    }
  }],

  deploy: {
    production: {
      ssh_options: ['ForwardAgent=yes'],
      user: Config.deployment.user,
      host: Config.deployment.host,
      repo: Config.deployment.repository,
      ref: Config.deployment.repositoryBranch,
      path: Config.deployment.path,
      'post-deploy': 'npm ci && pm2 startOrGracefulReload ecosystem.config.js --env production'
    }
  }
}
