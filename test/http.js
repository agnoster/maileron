var should = require('should')
, net = require('net')
, maileron = require('../').createServer()
, httpServer = maileron.httpServer
, request = require('request')

var port = 8080

describe('HTTP endpoints', function() {
  it('starts up', function(done) {
    httpServer.listen(8080, done)
  })

  it('lets you GET the messages for a user', function(done) {
    var message = { subject: "foobar", text: "hello world" }
    maileron.receive('user.1', message)
    request.get('http://localhost:8080/inbox/user.1', {json:true}, function(err, result) {
      result.body.should.eql([message])
      done()
    })
  })

  it('lets you DELETE to clear the message queue', function(done) {
    var message = { subject: "foobar", text: "hello world" }
    maileron.receive('user.2', message)
    maileron.list('user.2').should.eql([message])
    request.del('http://localhost:8080/inbox/user.2', function(err, result) {
      result.statusCode.should.equal(200)
      maileron.list('user.2').should.eql([])
      done()
    })
  })
})
