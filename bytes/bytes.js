module.exports = function types(value) {
  if (typeof value === 'string') {
    return parse(value)
  }

  if (typeof value === 'number') {
    return format(value)
  }
}

module.exports.format = format
module.exports.parse = parse

const map = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
  pb: 1024 ** 5,
}

const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i

/**
 * Format the given value in bytes into a string.
 * @param {number} value 
 */
function format(value) {
  if (!Number.isFinite(value)) {
    return null
  }

  const mag = Math.abs(value)
  let unit = ''

  if (mag > map.pb) {
    unit = 'PB'
  } else if (mag > map.tb) {
    unit = 'TB'
  } else if (mag > map.gb) {
    unit = 'GB'
  } else if (mag > map.mb) {
    unit = 'MB'
  } else if (mag > map.kb) {
    unit = 'KB'
  } else {
    unit = 'B'
  }

  const val = value / map[unit]
  const str = val.toFixed(2)

  return str
}

/**
 * Parse the string value into an integer in bytes. 
 */
function parse(value) {
  if (typeof value !== 'string') {
    return null
  }

  const results = parseRegExp.exec(value)
  let floatValue

  if (!results) {
    floatValue = parseInt(value, 10)
    unit = 'b'
  } else {
    floatValue = parseFloat(results[1])
    unit = results[4].toLowerCase()
  }

  if (Number.isNaN(floatValue)) {
    return null
  }

  return Math.floor(map[unit] * floatValue)
}
