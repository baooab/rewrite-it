> See <https://github.com/senchalabs/connect/blob/3.7.0/index.js>

simple usage:

```js
var connect = require('connect');
var http = require('http');

var app = connect();

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
app.listen(3000);
```

using middlewares:

```js
var connect = require('connect');
var http = require('http');

var app = connect();

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
app.listen(3000);
```
