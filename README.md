# Monody - a simple sensors manager
## Features
Monody has 2 simple features:
  1. provide some basic sensors to get informations like the CPU usage, memory usage, disk usage
  2. allow for regular interrogation of those sensors

## Stability
This is prototyping and snesors support only Ubuntu hosts. Contact me for other platforms.

## Installation
Install using npm:

    npm install monody

Create a `server.js` file:

    // file server.js
    const monody = require('monody');
    const sensors = require('monody/sensors');
    
    // standalone usage of a sensor
    sensors.cpu((cpu) => {
      console.log("current cpu usage", cpu);
    });
    
    // callback function to display data from the sensors
    function callback(data, sensorName) {
      console.log(sensorName, data);
    }
    
    // tested with Ubuntu only 
    // be carefull and give your sensors enough time to execute
    monody.addTask(sensors.cpu, callback, 5000);
    monody.addTask(sensors.mem, callback, 5000);
    
    // examples to get disk info and file size
    // monody.addTask([sensors.disk, '/dev/sda'], callback, 5000);
    // monody.addTask([sensors.fileInfo, 'your_file_name_here'], callback, 5000);

    monody.start();
    
Launch with `node server.js`.
## Available sensors
The package offers the following sensors:
  - cpu: cpu usage (float)
  - mem: mem usage (object)
  - disk: disk usage (float)
  - fileInfo: file informations(object)

## Roadmap
- improve documentation
- add more sensors
- error handling
- more examples

## Contribute
The interest of this package will grow with the number of sensors. If you are interested in publishing new sensors, contact me: paul.brie@gmail.com.

## Changelog
- 0.0.11 / 2016-08-29: documentation improvements