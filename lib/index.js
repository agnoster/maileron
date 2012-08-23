var smtp = require('./smtp')
, http = require('./http')

function Pat() {

  this.init()
}

Pat.prototype = {}

Pat.prototype.init = function() {

  this.mailboxes = {}

  this.smtpServer = smtp.createServer()
  this.smtpServer.on('message', this.receive.bind(this))

  this.httpServer = http.createServer(this)
}

Pat.prototype.clear = function(id) {

  delete this.mailboxes[id]
}

Pat.prototype.deliver = function(id, message) {

  if (!this.mailboxes[id]) this.mailboxes[id] = []

  this.mailboxes[id].push(message)
}

Pat.prototype.list = function(id) {

  return this.mailboxes[id] || []
}

Pat.prototype.receive = function(message) {

  return this.deliver(message.to, message)
}

module.exports = {
  createServer: function() {

    return new Pat()
  }
}
