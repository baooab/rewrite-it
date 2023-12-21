// See <https://github.com/jshttp/cookie/blob/v0.6.0/index.js>


exports.parse = parse
exports.serialize = serialize

/**
 * 
 * @param {*} str 
 * @param {*} options
 * @example
 * 
 * ```js
 * var cookies = cookie.parse('foo=bar; equation=E%3Dmc%5E2');
// { foo: 'bar', equation: 'E=mc^2' }
 * 
 * ```
 * @returns 
 */
function parse(str, options = {}) {
  const obj = {}

  let index = 0
  while (index < str.length) {
    const eqIdx = str.indexOf('=', index)

    // no more cookie pairs
    if (eqIdx === -1) {
      break
    }

    const endIdx = str.indexOf(';', index)
    if (endIdx === -1) {
      endIdx = str.length
    }

    const key = str.slice(index, eqIdx).trim()

    if (obj[key] === undefined) {
      const val = str.slice(eqIdx + 1, endIdx).trim()
      obj[key] = tryDecode(val)
    }

    index = endIdx + 1
  }

  return obj
}

function tryDecode(val) {
  try {
    return decodeURIComponent(val)
  } catch (error) {
    return val
  }
}


/**
 * @example
 * 
 * ```js
var setCookie = cookie.serialize('foo', 'bar');
// foo=bar
```
 */
function serialize(name, val, options = {}) {
  const value = encodeURIComponent(val)

  const str = `${name}=${value}`

  if (options.maxAge !== null && options.maxAge !== undefined) {
    str += `; Max-Age=${Math.floor(Number(maxAge))}`
  }

  if (options.domain) {
    str += `; Domain=${options.domain}`
  }

  if (options.path) {
    str += `; Path=${options.path}`
  }

  if (options.expires) {
    str += `; Expires=${options.expires.toUTCString()}`
  }

  if (options.httpOnly) {
    str += '; HttpOnly'
  }

  if (options.secure) {
    str += '; Secure'
  }

  // ??
  if (options.partitioned) {
    str += '; Partitioned'
  }

  // ??
  if (options.priority) {
    const priority = options.priority.toLowerCase()

    switch (priority) {
      case 'low':
        str += '; Priority=Low'
        break
      case 'medium':
        str += '; Priority=Medium'
        break
      case 'high':
        str += '; Priority=High'
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (options.sameSite) {
    const sameSite = typeof options.sameSite === 'string' ? options.sameSite.toLowerCase() : options.sameSite

    switch (sameSite) {
      case true:
      case 'strict':
        str += '; SameSite=Strict'
        break
      case 'lax':
        str += '; SameSite=Lax'
        break
      case 'none':
        str += '; SameSite=None'
        break
      default:
        throw new TypeError('option sameSite is invalid')
    }
  }

  return str
}
