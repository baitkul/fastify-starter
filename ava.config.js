export default {
  concurrency: 5,
  verbose: true,
  failFast: true,
  extensions: ['js'],
  files: [
    'test/**/*.spec.js',
    '!test/utils/**/*'
  ]
}
