var smtp = require('./smtp')

function Pat() {

    this.init()
}

Pat.prototype = {}

Pat.prototype.init = function() {

    this.mailboxes = {}

    this.smtpServer = smtp.createServer()
}

Pat.prototype.receive = function(message) {

    console.log('Received: ', JSON.stringify(message))
}

module.exports = {
    createServer: function() {

        return new Pat()
    }
}
