# rewrite connect


```js
exports = module.exports = createApplication;

function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };


  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // ...

  return app;
}
```

这一点与 Koa 不同。

```js
module.exports = class Application extends Emitter {
  // ...
}
```

Koa 是一个 `class`，初始化是通过 `new Koa` 方式，而非 Express 的函数调用形式。

```js
// Koa
const app = new Koa()
// Express
const app = express()
```

另外，通过 Koa 创建的 app 本身是一个对象，是不能直接传递给 http(s).createServer()，而通过 Express 创建的 app 本身是一个函数，是可以传递给 http(s).createServer()。

```js
const app = express()
http.createServer(app).listen(80)
https.createServer({ ... }, app).listen(443)
```
