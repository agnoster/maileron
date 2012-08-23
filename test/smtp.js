var should = require('should')
  , net = require('net')
  , pat = require('../').createServer()
  , smtpServer = pat.smtpServer
  , pony = require('pony')

var port = 2525
  , send = pony({ host: "localhost", port: port })

smtpServer.listen(port)

describe('SMTP listener', function() {

  it('exists', function() {
    should.exist(smtpServer)
  })

  it('can be connected to', function(ok) {
    net.connect(port, 'localhost', function() {
      ok()
    })
  })

  it('can have mail sent to it', function(ok) {
    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'hello there')
      req.setHeader('content-type', 'text/plain')
      req.end('This is from mocha. Hi!')
      ok()
    })
  })

  it('emits an event when it receives a message', function(ok) {
    smtpServer.once('message', function(message) {
        ok()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'hello there')
      req.setHeader('content-type', 'text/plain')
      req.end('This is from mocha. Hi!')
    })
  })

  it('parses the email correctly', function(ok) {
    smtpServer.once('message', function(message) {
        message.to.should.equal('user.1')
        message.headers.should.eql({subject: 'hello there', "content-type": 'text/plain'})
        message.body.should.equal('This is from mocha.\nHi!')
        message.subject.should.equal('hello there')
        ok()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'hello there')
      req.setHeader('content-type', 'text/plain')
      req.end('This is from mocha.\r\nHi!')
    })
  })
})
