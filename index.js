'use strict'

const url = require('url')

const routington = require('routington')
const series = require('fastseries')()

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

const routify = function (baseRoutes = {}) {
  // TODO: - map over the base routes and create
  const router = routington()
  const middleware = []

  // TODO: - Add support for default handler

  const use = function use (url, subRouter) {
    // TODO: - Add support for a subRouter
    if (typeof url === 'function') {
      middleware.push(url)
    } else {
      // route({
      //   url,
      //   router
      // })
    }
  }

  const route = function route (opts = {}) {
    if (!opts.url) {
      throw new Error('no url provided')
    }

    if (!opts.handler) {
      throw new Error(`no handler provided for url: ${opts.url}`)
    }

    if (HTTP_METHODS.indexOf(opts.method) === -1) {
      throw new Error(`${opts.method} is not a supported HTTP method`)
    }

    const { url, handler, method } = opts
    const node = router.define(url)[0]

    // TODO: - Add support for middleware for route and using a sub-router

    node[method] = node[method] || []
    node[method].push(handler)
  }

  const lookUp = function lookUp (req, res, next) {
    const match = router.match(url.parse(req.url).pathname)

    if (!match) {
      // 404
      return
    }

    const node = match.node
    const handlers = node[req.method] || []

    // TODO: - Add support for middleware for route and using a sub-router

    // const {handlers, middleware} = node[req.method]
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
