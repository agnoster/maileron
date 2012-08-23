var smtp = require('simplesmtp')
  , mailparser = require('mailparser')

function alwaysValidate(env, email, cb) {
  cb(null, true)
}

module.exports = {
  createServer: function() {

    var server = smtp.createServer({})

    server.on("startData", function(envelope){
      envelope.parser = new mailparser.MailParser
      envelope.parser.on('end', function(message) {
        delete envelope.parser
        message.envelope = envelope
        message.to = envelope.to[0].split('@')[0]
        server.emit('message', message)
      })
    })

    server.on("data", function(envelope, chunk){
      envelope.parser.write(chunk)
    })

    server.on("dataReady", function(envelope, callback){
      envelope.parser.end()
      callback(null, "QUEUE_NAME")
    })

    return server
  }
}
