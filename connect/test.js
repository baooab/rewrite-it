import http from 'http';

// See: https://nodejs.org/api/http.html#httpcreateserveroptions-requestlistener

const blog = http.createServer(function hello(req, res) {
  assert.equal(req.url, '/');
  res.end('blog');
});

// => equal to
// const blog = http.createServer();
// blog.on('request', function hello(req, res) {
//   assert.equal(req.url, '/');
//   res.end('blog');
// })


// Listen to the request event
blog.on('request', function hello2(request, res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    data: 'Hello World!',
  }));
});

console.log(blog.listeners('request')) // [ [Function: hello], [Function: hello2] ]
