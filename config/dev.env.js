'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://192.168.0.254:8094/boluo-crm/"',
  // BASE_API: '"http://192.168.0.130:8093/boluo-dict/"',
})
