module.exports = createApplication

const methods = require('node:http').METHODS.map(method => method.toLowerCase())

const application = {}

application.init = function init() {
  this.settings = {}
}

app.lazyrouter = function lazyrouter() {
  if (!this._router) {
    this._router = new Router({});
  }
}

application.listen = function listen() {
  const server = require('node:http').createServer(this)
  return server.listen.apply(server, arguments)
}

application.handle = function handle(req, res, callback) {
  const router = this._router;

  const done = callback || function () { }

  if (router) {
    router.handle(req, res, done);
  } else {
    done();
  }
}

/**
 * Delegate `.VERB(...)` calls to `router.VERB(...)`.
 */

methods.forEach(function (method) {
  application[method] = function (path) {
    this.lazyrouter();

    var route = this._router.route(path);
    route[method].apply(route, [].slice.call(arguments, 1));
    return this;
  };
});

function createApplication() {
  const app = function (req, res, next) {
    app.handle(req, res, next);
  }

  mergeDescriptors(app, application)

  app.init()
  return app
}


function mergeDescriptors(target, source) {
  for (const key of Object.getOwnPropertyNames(source)) {
    if (!Object.hasOwn(target, key)) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key))
    }
  }
}


function Router(options = {}) {
  function router(req, res, next) {
    router.handle(req, res, next);
  }

  Object.setPrototypeOf(router, routerProto)
  router.stack = [];
  return router
}

routerProto.route = function route(path) {
  const route = new Route(path);
  const layer = new Layer(path, {}, route.dispatch.bind(route))
  layer.route = route
  this.stack.push(layer);
  return route
}

routerProto.handle = function handle(req, res, done) {
  // ...
}


function Layer(path, options, fn) { }


function Route(path) {
  this.path = path;
  this.stack = [];

  // route handlers for various http methods
  this.methods = {};
}

Route.prototype.dispatch = function dispatch(req, res, done) {

}

methods.forEach(function (method) {
  Route.prototype[method] = function () {
    const handles = [].flat(slice.call(arguments));

    for (let i = 0; i < handles.length; i++) {
      const handle = handles[i];
    }

  }
}
