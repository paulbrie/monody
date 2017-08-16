/* eslint no-undef: 0 max-nested-callbacks: 0 */ 
const assert = require('assert')
const monody = require('../index')

describe('Task Manager', function () {
  describe('addTask', function () {
    it('should throw exception if first argument (main function) is not a function', () => {
      assert.throws(() => monody.addTask('not a function'), TypeError)
    })

    it('should throw exception if second argument (callback) is not a function', () => {
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

    it('should return the id of registered tasks', () => {
      assert.equal(monody.addTask(() => {}, () => {}, 1000), 0)
      assert.equal(monody.addTask(() => {}, () => {}, 1000), 1)
    })
  })

  describe('getTaskStatus()', function () {
    it('should return task status (object)', () => {
      assert.equal(monody.getTaskStatus(), undefined)
      const { key, paused, count, interval, repeat, launched } =
        monody.getTaskStatus(0)

      assert.equal(key, 1)
      assert.equal(paused, false)
      assert.equal(count, 0)
      assert.equal(interval, 1000)
      assert.equal(repeat, -1)
      assert.equal(launched, false)
    })
  })

  describe('pauseTask()', function () {
    it('should return true for "paused"', () => {
      monody.pauseTask(0)
      assert.equal(monody.getTaskStatus(0).paused, true)
    })
  })

  describe('resumeTask()', function () {
    it('should return false for "paused"', () => {
      monody.resumeTask(0)
      assert.equal(monody.getTaskStatus(0).paused, false)
    })
  })

  describe('start()', function () {
    it('should start all tasks"', () => {
      let started = true
      monody.start()
      monody.tasksStatus.map(({ paused, launched }) => {
        if (paused || !launched) {
          started = false
        }
      })
      assert.equal(started, true)
    })
  })

  describe('addTaskAndLaunch()', function () {
    it('should add a task and launch it immediately"', () => {
      const taskId = monody.addTaskAndLaunch(() => {}, () => {}, 1000)
      console.log(typeof taskId)
      assert.equal(typeof taskId, 'number')
      // const { launched, paused } = monody.getTaskStatus(taskId)
      // assert.equal(launched && !paused, true)
    })
  })

  describe('setTaskAsLaunched()', function () {
    it('should return new task status (true)', () => {
      assert.equal(monody.setTaskAsLaunched(1), true)
    })
  })
})
