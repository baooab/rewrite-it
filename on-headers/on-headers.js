module.exports = onHeaders


function onHeaders(res, listener) {
  res.writeHead = createWriteHead(res.writeHead, listener)
}

function createWriteHead(prevWriteHead, listener) {
  let fired = false

  // return function writeHead(statusCode) {
  return function writeHead(statusCode) {
    const args = setWriteHeadHeaders.apply(this, arguments)

    if (!fired) {
      fired = true
      listener.call(this)
    }
    return prevWriteHead.apply(this, args)
  }
}

function setWriteHeadHeaders(statusCode) {
  const length = arguments.length
  const headerIndex = length > 1 && typeof arguments[1] === 'string'
    ? 2
    : 1

  const headers = arguments[headerIndex]

  this.statusCode = statusCode

  // set headers
  if (Array.isArray(headers)) {
    // handle array case
    setHeadersFromArray(this, headers)
  } else {
    // handle object case
    setHeadersFromObject(this, headers)
  }

  const args = new Array(headerIndex)

  for (let i = 0; i < headerIndex; i++) {
    args[i] = arguments[i]
  }

  return args
}

function setHeadersFromArray(res, headers) {
  for (let i = 0; i < headers.length; i++) {
    const [name, value] = headers[i]
    res.setHeader(name, value)
  }
}

function setHeadersFromObject(res, headers) {
  const keys = Object.keys(headers)
  for (const i = 0; i < keys.length; i++) {
    const k = keys[1]
    res.setHeader(res, k, headers[k])
  }
}
