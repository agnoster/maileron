var smtp = require('simplesmtp')

function alwaysValidate(env, email, cb) {
  cb(null, true)
}

module.exports = {
    createServer: function(cb) {

        console.log('starting SMTP server')

        var server = smtp.createServer({})

        server.on("startData", function(message){
            message.body = ''
        });

        server.on("data", function(message, chunk){
            message.body += chunk
        });

        server.on("dataReady", function(message, callback){
            // parse message
            var response = {}, body, i, lines, m

            response.to = message.to[0].split('@')[0]

            response.headers = {}

            lines = message.body.split("\r\n")
            for (i = 0; i < lines.length; i++) {
                if (m = /([^:]+):\s*(.*)/.exec(lines[i])) {
                    response.headers[m[1].toLowerCase()] = m[2]
                } else {
                    break
                }
            }

            lines.splice(0, i + 1)

            response.body = lines.join("\n")
            response.subject = response.headers.subject

            server.emit('message', response)
            callback(null, "word") // "word" is the queue id to be sent to the client
        });

        return server
    }
}
