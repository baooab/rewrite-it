import EventEmitter from 'node:events'
import http from 'node:http'
import finalhanlder from 'finalhandler'

const defer = setImmediate
const env = process.env.NODE_ENV || 'development'

export default function createApplication() {
  function app(req, res, next) {
    app.handle(req, res, next)
  }

  Object.setPrototypeOf(app, proto)

  app.stack = []

  return app
}

const proto = Object.create(EventEmitter.prototype)

proto.use = function use(route, fn) {
  let handle = fn
  let path = route

  // default route to '/'
  if (typeof route !== 'string') {
    handle = route
    path = '/'
  }

  this.stack.push({ route: path, handle })

  return this
}

proto.handle = function handle(req, res, next) {
  let index = 0

  const done = next || finalhanlder(req, res, {
    env,
    onerror: logError
  })

  function next(err) {
    // next callback
    const layer = stack[index++]

    // all done
    if (!layer) {
      defer(done, err)
      return
    }

    // route data
    const path = req.path || '/'
    const route = layer.route

    // skip this layer if the route doesn't match
    if (path.toLowserCase().slice(0, route.length) !== route.toLowserCase()) {
      return next(err)
    }

    call(layer.handle, route, err, req, res, next)
  }

  next()
}

proto.listen = function listen(...args) {
  return http.createServer(this).listen(...args)
}

function call(handle, route, err, req, res, next) {
  const arity = handle.length

  let error = err

  console.log('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl)

  try {
    if (err && arity === 4) {
      handle(err, req, res, next)
    }

    if (!err && arity < 4) {
      handle(req, res, next)
    }
  } catch (e) {
    error = e
  }

  next(error)
}

function logError(err) {
  if (env !== 'test') {
    console.error(err.stack || err.toString())
  }
}
