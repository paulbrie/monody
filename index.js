'use strict'

class Monody {
  constructor() {
    this.tasks = [];
    this.tasksStatus = [];
  }
  
  addTask(func, callback, interval, repeat = -1) {
    const index = this.tasks.length;
    this.tasks.push({ func, callback, interval, repeat });  
    this.tasksStatus.push({
      key: index,
      run: true,  // run the task if true
      count: 0,   // count the number of executions
      interval,
      repeat,
    });  
    
    return index;
  }
  
  pauseTask(key) {
    this.tasksStatus[key].run = false;
  }
  
  resumeTask(key) {
    this.tasksStatus[key].run = true;
    this.launch(key);
  }
  
  getTaskStatus(key) {
    return this.tasksStatus[key];
  }
  
  start() {
    this.tasks.map((task, key) => this.launch(key));
  }
  
  launch(key) {
    const task = this.tasks[key];
    // check interval attribute
    if(!task.interval || typeof task.interval !== 'number') 
      this.e('a valid interval is required.');
    
    // build function and params from task 
    const func = 
      typeof task.func === 'function' ?
      task.func :
      task.func[0];
      
    const params = task.func[1] || null;
    
    // launch the task
    (function self (context) {
      // if the task status is set to true it should be invoked
      if(context.tasksStatus[key].run) {
        // add this execution to the counter
        context.tasksStatus[key].count++;
        
        // decrement from the repetitions if any
        if(context.tasksStatus[key].repeat >= 0)
          context.tasksStatus[key].repeat --;
        
        func.call(null, task.callback, params, context.tasksStatus[key]);
        
        // check for repetitions
        if(context.tasksStatus[key].repeat > 0 ||
           context.tasksStatus[key].repeat === -1)
          
          // program a new execution
          setTimeout(() => self(context), task.interval); 
      } 
    })(this);  
  }
  
  e(msg) {
    throw Error('[monody]: ' + msg);
  }
}

module.exports = new Monody();