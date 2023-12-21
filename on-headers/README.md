See: https://github.com/jshttp/on-headers/blob/v1.0.2/index.js


```js
var http = require('http')
var onHeaders = require('on-headers')

http
  .createServer(onRequest)
  .listen(3000)

function addPoweredBy () {
  // set if not set by end of request
  if (!this.getHeader('X-Powered-By')) {
    this.setHeader('X-Powered-By', 'Node.js')
  }
}

function onRequest (req, res) {
  onHeaders(res, addPoweredBy)

  res.setHeader('Content-Type', 'text/plain')
  res.end('hello!')
}
```

on-headers 用于在一次请求中，在所有响应头被设置之后、实际响应之前触发一个回调函数。


实现原理：

1. res.writeHead() 方法总是会被调用
2. res.writeHead() 方法会被重新写成下面这样

```js
// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
}); 

// =>

// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.setHeader('Content-Type', 'text/plain');
  // call listener() here!
  res.writeHead(200);
  res.end('ok');
}); 
```

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain',
  })
  .end(body); 

// =>

const body = 'hello world';

response.sertHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Content-Type', 'text/plain');
// call listener() here!
response
  .writeHead(200)
  .end(body);
```

即，将 response.setHeader(status, headers) 拆分成 response.setHeader(headers) 和 response.writeHead(status) 的形式，在中间我们就能放置我们的监听回调了

3. writeHead() 的代理方法内部在调用 listener 的时候，需要引入一个 fired 标识，确保 listener 只调用一次。处理 `res.writeHead(200);  try { res.writeHead(200) } catch (e) {}` 的场景
