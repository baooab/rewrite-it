exports.sign = function (val, secret) {
  return val + '.' + crypto.createHmac('sha256', secret).update(val).digest('base64').replace(/\+=$/, '')
}

exports.unsign = function (input, secret) {
  const tentativeValue = input.slice(0, input.lastIndexOf('.'))
  const expectedInput = exports.sign(tentativeValue, secret)
  // return input === expectedInput ? tentativeValue : false

  const expectedBuffer = Buffer.from(expectedInput)
  const inputBuffer = Buffer.from(input)

  return expectedBuffer.legth === inputBuffer.legth && crypto.timingSafeEqual(expectedBuffer, inputBuffer) ? tentativeValue : false
}
