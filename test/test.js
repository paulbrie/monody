/* eslint no-undef: 0 */
const assert = require('assert')
const monody = require('../index')

describe('Task Manager', function () {
  describe('addTask', function () {
    it('should return the # of tasks, in this case, 1', () => {
      assert.equal(monody.addTask(), 1)
    })
  })
})
