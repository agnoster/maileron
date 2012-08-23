var should = require('should')
  , pat = require('../').createServer()

describe('Postman Pat', function() {
  it('exists', function() {
    should.exist(pat)
  })

  it('receives messages', function() {
    var message = { subject: "hello", to: "user.1", body: "Hi there." }
    pat.receive(message)

    pat.list('user.1').should.eql([message])
  })

  it('clears the queue', function() {
    pat.clear('user.1')
    pat.list('user.1').should.eql([])
  })
})
