var cp = require('child_process')
  , should = require('should')
  , request = require('request')
  , pony = require('pony')

var http_port = 31080
  , smtp_port = 31025
  , pat, send = pony({ host: "localhost", port: smtp_port, from: "mocha@pat.agnoster.net" })

describe('Command-line tool', function() {

    before(function() {
        pat = cp.execFile('./bin/postman-pat', ['-s', smtp_port, '-h', http_port])
    })

    it('can be started with custom ports', function(done) {
        pat.stdout.once('data', function(chunk) {
          done()
        })
    })

    it('responds to sending emails', function(done) {
        send({ to: "int.1@pat.agnoster.net" }, function(err, req) {
            should.not.exist(err)
            req.setHeader('subject', 'Howdy')
            req.setHeader('content-type', 'text/plain')
            req.end('Hello world.')
            done()
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
