var should = require('should')
, maileron = require('../').createServer()

describe('Maileron', function() {
  it('exists', function() {
    should.exist(maileron)
  })

  it('receives messages', function() {
    var message = { subject: "hello", text: "Hi there." }
    maileron.receive('user.1', message)

    maileron.list('user.1').should.eql([message])
  })

  it('clears the queue', function() {
    maileron.clear('user.1')
    maileron.list('user.1').should.eql([])
  })
})
