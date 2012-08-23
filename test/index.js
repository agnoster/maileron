var should = require('should')
  , pat = require('../').createServer()

describe('Postman Pat', function() {
  it('exists', function() {
    should.exist(pat)
  })
})
