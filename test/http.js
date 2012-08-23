var should = require('should')
  , net = require('net')
  , pat = require('../').createServer()
  , httpServer = pat.httpServer
  , request = require('request')

var port = 8080

describe('HTTP endpoints', function() {
  before(function() {
    httpServer.listen(8080)
  })

  it('lets you GET the messages for a user', function(ok) {
    var message = { subject: "foobar", to: "user.1", body: "hello world" }
    pat.receive(message)
    request.get('http://localhost:8080/inbox/user.1', {json:true}, function(err, result) {
        result.body.should.eql([message])
        ok()
    })
  })

  it('lets you DELETE to clear the message queue', function(ok) {
    var message = { subject: "foobar", to: "user.2", body: "hello world" }
    pat.receive(message)
    pat.list('user.2').should.eql([message])
    request.del('http://localhost:8080/inbox/user.2', function(err, result) {
        result.statusCode.should.equal(200)
        pat.list('user.2').should.eql([])
        ok()
    })
  })
})
