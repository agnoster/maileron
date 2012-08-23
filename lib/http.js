var restify = require('restify')

module.exports.createServer = function(maileron) {

  var server = restify.createServer()
  server.get('/inbox/:id', function(req, res, next) {

    res.send(maileron.list(req.params.id))
  })

  server.del('/inbox/:id', function(req, res, next) {
    maileron.clear(req.params.id)
    res.end()
  })

  return server
}
