'use strict'

class Monody {
  constructor() {
    this.tasks = [];
  }
  
  addTask(func, callback, interval) {
    this.tasks.push({ func, callback, interval });  
  }
  
  start() {
    this.tasks.map((task) => {
      // check interval attribute
      if(!task.interval || typeof task.interval!== 'number') 
        this.e('a valid interval is required.');
      
      // build function and params from task 
      const func = 
        typeof task.func === 'function' ?
        task.func :
        task.func[0];
        
      const params = task.func[1] || null;
      
      // launch the task
      (function self () {
        func.call(null, task.callback, params);
        setTimeout(self, task.interval);
      })();
    });  
  }
  
  e(msg) {
    throw Error('[monode]: ' + msg);
  }
}

module.exports = new Monody();