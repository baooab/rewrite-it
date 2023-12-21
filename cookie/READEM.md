See <https://www.npmjs.com/package/cookie>

Usage:

```js
var cookie = require('cookie');
```

```js
var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');
// { foo: 'bar', equation: 'E=mc^2' }
```

```js
var setCookie = cookie.serialize('foo', 'bar');
// foo=bar
```
