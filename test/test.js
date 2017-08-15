/* eslint no-undef: 0 max-nested-callbacks: 0*/ 
const assert = require('assert')
const monody = require('../index')

describe('Task Manager', function () {
  describe('addTask', function () {
    it('should throw exception if first argument is not a function', () => {
      assert.throws(() => monody.addTask('not a function'), TypeError)
    })

    it('should throw exception if second argument is not a function', () => {
      assert.throws(
        () => monody.addTask(() => {}, 'not a function'),
        TypeError
      )
    })

    it('should throw exception if third argument (interval) is not a number', () => {
      assert.throws(
        () => monody.addTask(() => {}, () => {}, 'not a number'),
        TypeError
      )
    })

    it('should throw exception if third argument (interval) is not greater than 0', () => {
      assert.throws(
        () => monody.addTask(() => {}, () => {}, 0),
        RangeError
      )
    })

    it('should return the # of registered tasks', () => {
      assert.equal(monody.addTask(() => {}, () => {}, 1000), 1)
      assert.equal(monody.addTask(() => {}, () => {}, 1000), 2)
    })
  })
})
