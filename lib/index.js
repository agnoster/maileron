var smtp = require('./smtp')
, http = require('./http')

function Maileron() {

  this.init()
}

Maileron.prototype = {}

Maileron.prototype.init = function() {

  this.mailboxes = {}

  this.smtpServer = smtp.createServer()
  this.smtpServer.on('message', this.receive.bind(this))

  this.httpServer = http.createServer(this)
}

Maileron.prototype.clear = function(id) {

  delete this.mailboxes[id]
}

Maileron.prototype.deliver = function(id, message) {

  if (!this.mailboxes[id]) this.mailboxes[id] = []

  this.mailboxes[id].push(message)
}

Maileron.prototype.list = function(id) {

  return this.mailboxes[id] || []
}

Maileron.prototype.receive = function(message) {

  return this.deliver(message.to, message)
}

module.exports = {
  createServer: function() {

    return new Maileron()
  }
}
