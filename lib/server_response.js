
const BufferList = require('bl')
    , util       = require('util')
    , generate  = require('coap-packet').generate

function CoAPServerResponse(request, send) {
  BufferList.call(this)

  this._packet = {
      messageId: request.messageId
    , token: request.token
    , options: []
  }
  this._send = send

  this.statusCode = '2.00'
}

util.inherits(CoAPServerResponse, BufferList)

CoAPServerResponse.prototype.setOption = function(name, values) {
  var i

  this._packet.options = this._packet.options.filter(function(option) {
    return option.name !== name
  })

  if (!Array.isArray(values))
    values = [values]
 
  for (i = 0; i < values.length; i++) {
    if (typeof values[i] === 'string')
      values[i] = new Buffer(values[i])

    this._packet.options.push({ name: name, value: values[i] })
  }

  return this
}

CoAPServerResponse.prototype.setHeader = CoAPServerResponse.prototype.setOption

CoAPServerResponse.prototype.end = function(a, b) {
  BufferList.prototype.end.call(this, a, b)

  var packet = this._packet
    , message
    , that = this

  packet.code = toCode(this.statusCode)
  packet.payload = this.slice()

  try {
    message = generate(packet)
  } catch(err) {
    this.emit('error', err)
    return
  }

  this._send(message)
  
  return this
}

function toCode(code) {
  if (typeof code === 'string')
    return code

  var first  = Math.floor(code / 100)
    , second = code - first * 100
    , result = ''

  result += first + '.'

  if (second < 10)
    result += '0'

  result += second

  return result
}

module.exports = CoAPServerResponse