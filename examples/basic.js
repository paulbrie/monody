const monody = require('../index')

// custom sensor
function customSensorTime (callback, options, taskStatus) {
  const responseData = {
    status: true,
    data: {
      time: new Date()
    },
    msg: '',
    extra: null
  }

  callback(responseData, 'time')
}

// callback function to display data from the sensors
function callback (data, sensorName, taskStatus) {
  console.log(sensorName, data)
}

// be carefull and give your sensors enough time to execute
monody.addTask(customSensorTime, callback, 1000)

monody.start()
