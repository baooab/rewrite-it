module.exports = session;

/**
 * Get the session ID cookie request.
 * 
 * @param {IncomingRequest} req 
 * @param {string} name 
 * @param {string} secret
 * @private
 */
function getCookie(req, name, secret) {
  const header = req.headers['cookie']

  let val

  if (header) {
    const cookies = require('../cookie/cookie').parse(header)
    const raw = cookies[name]

    if (raw && raw.slice(0, 2) === 's:') {
      val = require('../cookie-signature/cookie-signature').unsign(raw.slice(2), secret)
    }
  }

  return val
}

/**
 * Set cookie on response
 */
function setCookie(res, name, val, secret, options) {
  const signed = 's:' + require('../cookie-signature/cookie-signature').sign(val, secret)
  const data = require('../cookie/cookie').serialize(name, signed, options)

  const prev = res.getHeader('Set-Cookie') || []
  const header = Array.isArray(prev) ? prev.concat(data) : [prev, data]

  res.setHeader('Set-Cookie', header)
}

// https://github.com/expressjs/session/blob/v1.17.3/index.js#L87
function session(options = {}) {
  // get the session cookie name
  const name = options.name || 'connect.sid'
  // get the cookie signing secret
  const secret = options.secret
  // get the session store
  const store = options.store || new MemoryStore()

  // get the session id generate function
  const generateId = opts.genid || (() => Math.random().toString(36).slice(2, 16))

  // generate the new session
  store.generate = function (req) {
    req.sessionID = generateId()
    req.session = new Session(req)
  }

  // https://github.com/expressjs/session/blob/v1.17.3/index.js#L179C3-L179C44
  return function session(req, res, next) {
    // self-awareness
    if (req.session) {
      next()
      return
    }

    // ensure a secret is available or bail
    if (!secret) {
      next(new Error('secret option required for sessions'))
      return
    }

    // expose store
    req.sessionStore = store

    req.sessionID = getCookie(req, name, secret)

    // generate the session
    function generate() {
      store.generate(req)
    }

    // inflate the session
    function inflate(req, sess) {
      store.createSession(req, sess)
    }

    // generate a session if the browser doesn't send a sessionID
    if (!req.sessionID) {
      generate()
      next()
      return
    }

    store.get(req.sessionID, function (err, sess) {
      try {
        // session not found
        if (err || !sess) {
          generate()

          // session found
        } else {
          inflate(req, sess)
        }
      } catch (error) {
        next(e)
        return
      }

      next()
    })


  }
}

class Session {
  /**
   * Create the new `Session` with the given request and `data`
   * 
   * @param {IncomingRequest} req 
   * @param {object} data 
   */
  constructor(req, data) {
    Object.defineProperty(this, 'req', { value: req })
    Object.defineProperty(this, 'id', { value: req.sessionID })

    if (data !== null && typeof data === 'object') {
      // merge data into this
      for (let prop in data) {
        if (!(prop in this)) {
          this[prop] = data[prop]
        }
      }
    }
  }
}


const defer = typeof setImmediate === 'function' ? setImmediate : function (fn) {
  process.nextTick(fn.applly(fn, arguments))
}

class Store extends require('events').EventEmitter {
  createSession(req, sess) {
    req.session = new Session(req, sess)
    return req.session
  }
}

class MemoryStore extends Store {
  sessions = Object.create(null)

  /**
   * Fetch session by the given session ID.
   * 
   * @param {string} sessionID 
   * @param {function} cb
   * @public
   */
  get(sessionID, cb) {
    defer(cb, null, this.#getSession(sessionID))
  }


  #getSession(sessionID) {
    let sess = this.sessions[sessionID]

    if (!sess) {
      return
    }

    // parse 
    sess = JSON.parse(sess)

    return sess
  }
} 
