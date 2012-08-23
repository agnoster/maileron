var should = require('should')
  , net = require('net')
  , pat = require('../').createServer()
  , smtpServer = pat.smtpServer
  , pony = require('pony')

var port = 2525 + Math.floor(Math.random() * 1000)
  , send = pony({ host: "localhost", port: port })

describe('SMTP listener', function() {

  it('exists', function() {
    should.exist(smtpServer)
  })

  it('starts up', function(done) {
    smtpServer.listen(port, done)
  })

  it('can be connected to', function(ok) {
    net.connect(port, 'localhost', function() {
	console.log(arguments)
      ok()
    })
  })

  it('emits an event when it receives a message', function(ok) {
    smtpServer.once('message', function(message) {
        ok()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'Test 1')
      req.setHeader('content-type', 'text/plain')
      req.end('This is from mocha. Hi!')
    })
  })

  it('parses the email correctly', function(ok) {
    smtpServer.once('message', function(message) {
        message.to.should.equal('user.1')
        message.headers.should.eql({subject: 'Test 2', "content-type": 'text/plain'})
        message.body.should.equal("This is from mocha.\nHi!")
        message.subject.should.equal('Test 2')

        ok()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'Test 2')
      req.setHeader('content-type', 'text/plain')
      req.write("This is from mocha.\n")
      req.end("Hi!")
    })
  })
})
