# Monody - a simple sensors manager
## Features
Monody has 2 simple features:
  1. provide some basic sensors to get informations like the CPU usage, memory usage, disk usage
  2. allow for regular interrogation of those sensors

## Stability
This package is in a prototyping stage and sensors support only Ubuntu hosts. Contact me for other platforms.
I DO NOT recommend using this in production for now since there might be some breaking changes.

## Node compatibility
Tested starting 4.4.0.

## Installation

Install using npm:

```bash
npm install monody
```

Create a `server.js` file:
```javascript
// file server.js
const monody = require('monody');
const sensors = require('monody/sensors');

// standalone usage of a sensor
sensors.cpu((cpu) => {
  console.log("current cpu usage", cpu);
});

// template for custom sensors
function customSensorTime(cb, options, taskStatus) {
  const responseData = {
    status: true,
    data: {
      time: new Date()
    },
    msg: "",
    extra: null
  }
  
  cb(responseData, "time");
}

// options for a http sensor
var options = {
  method: 'GET',
  host: 'nodejs.org',
  path: '/en/',
  port: 443
}

// general callback function to display data from the sensors
function callback(data, sensorName, taskStatus) {
  console.log(sensorName, data);
}

// tested with Ubuntu only 
// be carefull and give your sensors enough time to execute
monody.addTask(customSensorTime, callback, 1000);
monody.addTask(sensors.cpu, callback, 5000);
monody.addTask(sensors.mem, callback, 5000);
monody.addTask([sensors.http, options], callback, 5000);

// examples to get disk info and file size
// monody.addTask([sensors.disk, '/dev/sda'], callback, 5000);
// monody.addTask([sensors.fileInfo, 'your_file_name_here'], callback, 5000);

monody.start();
```
    
Launch with `node server.js`.

## Anatomy of a sensor
A Monody sensor is a function that accepts two parameters:

- a callback function
- an options object

Monody will pass 3 parameters to the callback function:

- a response object:
  - a status (boolean or string)
  - a data object 
  - a string message generally used for informations about errors 
  - an extra parameter which can be of any type
- a tag name (string) used by the scheduler to identify the sensor
- a taskStatus object

Let's see an example that can be used as a template for your own custom sensors.

```javascript
function sensorTime(cb) {
  
  const responseData = {
    status: true,
    data: {
      time: new Date()
    },
    msg: "",
    extra: null
  }
   
  // monody will inject the task status as 3rd argument to the sensor function
  // therefore we will use the arguments array to pass it to the callback
  cb(responseData, "time", arguments[2]);
}
```

## Available sensors
The package offers the following sensors:
  - cpu: cpu usage (float)
  - mem: mem usage (object)
  - disk: disk usage (float)
  - fileInfo: file informations(object)
  - (NEW) http: executes a http call (using node http.request) and returns the native response object 

## Roadmap
- improve documentation
- add more sensors
- error handling
- more examples

## Contribute
The interest of this package will grow with the number of sensors. If you are interested in publishing new sensors, contact me: paul.brie@gmail.com.

## Changelog
- 0.0.23 / 2016-09-04: added compatibility for node 4.4.x and greater
- 0.0.22 / 2016-09-04: added new functions: pauseTask, resumeTask, addTaskAndLaunch, repetitions
- 0.0.17 / 2016-09-01: documentation update
- 0.0.16 / 2016-09-01: bug corrections
- 0.0.15 / 2016-09-01: minor corrections
- 0.0.14 / 2016-09-01: new http sensor, all sensors return a standard response object
- 0.0.13 / 2016-08-29: documentation improvements