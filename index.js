'use strict'

class Monody {
  constructor () {
    this.tasks = []
    this.tasksStatus = []
  }

  addTask (func, callback, interval, repeat = -1) {
    if (typeof func !== 'function') {
      throw new TypeError('first argument should be a function')
    }

    if (typeof callback !== 'function') {
      throw new TypeError('second argument should be a function')
    }

    if (typeof interval !== 'number') {
      throw new TypeError('interval should be a number and greater than 0')
    }

    if (interval <= 0) {
      throw new RangeError('interval should be greater than 0')
    }

    this.tasks.push({ func, callback, interval, repeat })
    this.tasksStatus.push({

      // key of the task in the tasks array
      key: this.tasks.length,

      // run the task if true
      paused: false,

      // count the number of executions. Will stop at Number.MAX_SAFE_INTEGER
      count: 0,

      // interval in ms between executions
      interval,

      // the number of times the task should be repeated
      repeat,

      // by default a task is not lauched until the function launch has been 
      // called at least once
      launched: false
    })

    return this.tasks.length
  }

  addTaskAndLaunch (func, callback, interval, repeat = -1) {
    const key = this.addTask(func, callback, interval, repeat)
    this.launch(key)
    return key
  }

  pauseTask (key) {
    this.tasksStatus[key].paused = true
  }

  resumeTask (key) {
    if (this.tasksStatus[key].paused) {
      this.tasksStatus[key].paused = false
      this.launch(key)
    }
  }

  getTaskStatus (key) {
    return this.tasksStatus[key]
  }

  start () {
    this.tasks.map((task, key) => {
      // block start from executing the task more than once
      if (!this.tasksStatus[key].launched) {
        this.setTaskAsLaunched(key)
        this.launch(key)
      }
    })
  }

  launch (key) {
    const task = this.tasks[key]

    // check interval attribute
    if (!task.interval || typeof task.interval !== 'number') {
      this.e('a valid interval is required.')
    }

    // build function and params from task 
    const func =
      typeof task.func === 'function'
        ? task.func
        : task.func[0]

    const params = task.func[1] || null;

    // launch the task
    (function self (context) {
      // if the task status is set to true it should be invoked
      if (!context.tasksStatus[key].paused) {
        // add this execution to the counter
        context.tasksStatus[key].count++

        // decrement from the repetitions if any
        if (context.tasksStatus[key].repeat >= 0) {
          context.tasksStatus[key].repeat--
        }

        func(task.callback, params, context.tasksStatus[key])

        // check for repetitions
        if (context.tasksStatus[key].repeat > 0 ||
          context.tasksStatus[key].repeat === -1) {
          // program a new execution
          setTimeout(() => self(context), task.interval)
        }
      }
    })(this)
  }

  e (msg) {
    throw Error('[monody]: ' + msg)
  }

  /**
   * Marks a task as being launched. A launched task can not be launched again,
   * only resumed.
   * @param {number} key - task id
   */
  setTaskAsLaunched (key) {
    this.tasksStatus[key].launched = true
  }
}

module.exports = new Monody()
