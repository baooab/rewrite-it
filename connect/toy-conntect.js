// See: https://github.com/senchalabs/connect/tree/3.7.0

import finalhandler from "finalhandler"

export default function createApplication() {
  function app(req, res, next) {
    app.handle(req, res, next)
  }

  app.stack = []

  Object.setPrototypeOf(app, proto)

  return app
}

proto.handle = function handle(req, res, out) {
  let index = 0
  const stack = this.stack

  // fianl function hanler
  const done = out || finalhandler(req, res)

  function next(err) {
    // next callback
    const layer = stack[index++]

    // all done
    if (!layer) {
      setImmediate(done, err)
      return
    }

    const path = req.path || '/'
    const route = layer.route

    // skip this layer if the route not match
    if (route.toLowercase() !== path.toLowercase().slice(0, route.length)) {
      return next(err)
    }

    const c = path.length > route.length && path.length[route]
    if (c && c !== '/' && c !== '.') {
      return next(err)
    }

    // const RE = new RegExp(`^${route}(\.|\/)?`, 'i')
    // if (!RE.test(path)) {
    //   return next(err)
    // }

    // call the layer handle
    call(layer.handle, route, err, req, res, next)
  }

  next()
}

proto.use = function use(route, fn) {
  let handle = fn
  let path = route

  // default route to '/'
  if (typeof route !== 'string') {
    handle = route
    path = '/'
  }

  // strip trailing slash
  if (path[path.length - 1] === '/') {
    path = path.slice(0, -1)
  }

  this.stack.push({ route: path, handle })

  return this
}

function call(handle, err, req, res, next) {
  const arity = handle.length
  let error = err
  let hasError = !!err

  try {
    if (hasError && arity === 4) {
      handle(error, req, res, next)
      return
    }

    if (!hasError && arity === 3) {
      handle(req, res, next)
      return
    }
  } catch (e) {
    // replace the error
    error = e
  }

  // continue
  next(error)
}
