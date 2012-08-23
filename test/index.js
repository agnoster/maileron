var should = require('should')
, maileron = require('../').createServer()

describe('Maileron', function() {
  it('exists', function() {
    should.exist(maileron)
  })

  it('receives messages', function() {
    var message = { subject: "hello", to: "user.1", body: "Hi there." }
    maileron.receive(message)

    maileron.list('user.1').should.eql([message])
  })

  it('clears the queue', function() {
    maileron.clear('user.1')
    maileron.list('user.1').should.eql([])
  })
})
