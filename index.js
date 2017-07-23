'use strict'

const url = require('url')
const assert = require('assert')

const routington = require('routington')
const series = require('fastseries')()

const HTTP_METHODS = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS']

const routify = function(baseRoutes = {}) {
  const router = routington()
  const middleware = []

  Object.keys(baseRoutes).forEach(url => {
    route(Object.assign({ url }, baseRoutes[url]))
  })

  const use = function use(url, subRouter) {
    if (typeof url === 'function') {
      middleware.push(url)
    }
  }

  const route = function route(opts = {}) {
    assert(opts.url, 'no url provided')
    assert(opts.handler, `no handler provided for url: ${opts.url}`)
    assert(opts.method, `no HTTP method provided`)
    assert(HTTP_METHODS.indexOf(opts.method) !== -1, `${opts.method} is not a supported HTTP method`)

    const { url, handler, method } = opts
    const node = router.define(url)[0]

    node[method] = node[method] || []
    node[method].push(handler)
  }

  const lookUp = function lookUp(req, res, next) {
    const match = router.match(url.parse(req.url).pathname)

    if (!match) {
      // 404
      return
    }

    const node = match.node
    const handlers = node[req.method] || []

    if (!handlers) {
      // 405
      return
    }

    series(null, [...middleware, ...handlers], { req, res }, next)
  }

  return {
    route,
    lookUp,
    use
  }
}

module.exports = routify
