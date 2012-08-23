var should = require('should')
, net = require('net')
, maileron = require('../').createServer()
, smtpServer = maileron.smtpServer
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

  it('can be connected to', function(done) {
    net.connect(port, 'localhost', done)
  })

  it('emits an event when it receives a message', function(done) {
    smtpServer.once('message', function(id, message) {
      done()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'Test 1')
      req.setHeader('content-type', 'text/plain')
      req.end('This is from mocha. Hi!')
    })
  })

  it('parses the email correctly', function(done) {
    smtpServer.once('message', function(id, message) {
      id.should.equal('user.1')
      message.headers.should.eql({subject: 'Test 2', "content-type": 'text/plain'})
      message.text.should.equal("This is from mocha.\nHi!")
      message.subject.should.equal('Test 2')

      done()
    })

    send({ to: "user.1@agnoster.net", from: "mocha@agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('Subject', 'Test 2')
      req.setHeader('Content-type', 'text/plain')
      req.write("This is from mocha.\n")
      req.end("Hi!")
    })
  })
})
