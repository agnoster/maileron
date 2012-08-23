var restify = require('restify')

module.exports.createServer = function(pat) {

  var server = restify.createServer()
  server.get('/inbox/:id', function(req, res, next) {

    res.send(pat.list(req.params.id))
  })

  server.del('/inbox/:id', function(req, res, next) {
    pat.clear(req.params.id)
    res.end()
  })

  return server
}
