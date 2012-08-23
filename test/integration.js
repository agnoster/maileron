var cp = require('child_process')
, should = require('should')
, request = require('request')
, pony = require('pony')
, net = require('net')

var http_port = 10000 + Math.floor(Math.random() * 10000)
, smtp_port = http_port + 1
, pat, send = pony({ host: "localhost", port: smtp_port, from: "mocha@pat.agnoster.net" })

describe('Command-line tool', function() {

  it('starts up', function(done) {
    pat = cp.execFile('./bin/postman-pat', ['-s', smtp_port, '-h', http_port])
    done()
  })

  after(function() {
    pat.kill()
  })

  it('can be started with custom ports', function(done) {
    pat.stdout.once('data', function(chunk) {
      // give it a moment to start up
      setTimeout(done, 500)
    })
  })

  it('responds on the SMTP port ' + smtp_port, function(done) {
    net.connect(smtp_port, 'localhost', done)
  })

  it('responds on the HTTP port ' + http_port, function(done) {
    net.connect(http_port, 'localhost', done)
  })

  it('responds to sending emails', function(done) {
    send({ to: "int.1@pat.agnoster.net" }, function(err, req) {
      should.not.exist(err)
      req.setHeader('subject', 'Howdy')
      req.setHeader('content-type', 'text/plain')
      req.end('Hello world.')
      setTimeout(done, 1000)
    })
  })

  it('shows the email when we check for it', function(done) {
    request.get("http://localhost:" + http_port + "/inbox/int.1", {json:true},
      function(err, res) {
        should.not.exist(err)
        res.body.should.eql([{ subject: "Howdy", body: "Hello world.", to: "int.1",
          headers: {subject: "Howdy", "content-type": "text/plain"}}])
          done()
      })
  })

  it('responds to DELETE', function(done) {
    request.del("http://localhost:" + http_port + "/inbox/int.1", done)
  })

  it('shows a cleared mailbox', function(done) {
    request.get("http://localhost:" + http_port + "/inbox/int.1", {json:true},
      function(err, res) {
        should.not.exist(err)
        res.body.should.eql([])
        done()
      })
  })
})
