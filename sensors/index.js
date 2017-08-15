'use strict'

const cmd = require('node-cmd')
const http = require('http')
const response = require('../utils').response

class Sensors {
  /**
   * this is a simple wrapper over the native http.request function
   * @param {function} cb - callback function
   * @param {object} options - http request options object 
   * {@link https://nodejs.org/api/http.html#http_http_request_options_callback | http.request}
   */
  static http (cb, options, tasksStatus) {
    http.request(options, function (res) {
      cb(response(true, res), 'http', tasksStatus)
    }).on('error', (err) => {
      cb(response(false, {}, 'http.request error', err), 'http', tasksStatus)
    }).end()
  }

  /**
   * returns total, free, and available memory
   * @param cb - callback(data, name)
   */
  static mem (cb, options, tasksStatus) {
    function get (data, lineNumber) {
      const line = data.split('\n')[lineNumber]
      const parts = line.split(' ')
      return parts[parts.length - 2] / 1024
    }

    cmd.get(
      'cat /proc/meminfo',
      (data) => {
        const responseData = {
          total: get(data, 0),
          free: get(data, 1),
          available: get(data, 2)

        }

        cb(response(true, responseData), 'mem', tasksStatus)
      })
  }

  /**
   * returns cpu load (user + system)
   * @param cb - callback(data, name)
   */
  static cpu (cb, options, tasksStatus) {
    cmd.get(
      // we need two iterations from top (first one seems to be dummy)
      "top - bn2 | grep ' id,'",
      (data) => {
        const patt = /(\d{1,3}\.\d) id,/i
        const line2 = data.split('\n')[1]
        // then we take the second occurence/line

        const responseData = {
          load: parseFloat((100 - line2.match(patt)[1]).toFixed(1))
        }

        cb(response(true, responseData), 'cpu', tasksStatus)
      }
    )
  }

  /**
   * returns disk usage
   * @param cb - callback(data, name)
   * @param partName mount point
   */
  static disk (cb, partName, tasksStatus) {
    cmd.get(
      'df -h | grep ' + partName,
      (data) => {
        const patt = /([0-9]{1,3})%/i

        const responseData = {
          free: parseFloat(data.match(patt)[0])
        }

        cb(response(true, responseData), 'disk ' + partName, tasksStatus)
      }
    )
  }

  /**
   * returns file size
   * @param cb - callback(data, fileName)
   */
  static fileInfo (cb, fileName, tasksStatus) {
    cmd.get(
      'ls -la ' + fileName,
      (data) => {
        const responseData = {
          usage: data.split(' ')[4]
        }

        cb(response(true, responseData), 'fileInfo ' + fileName, tasksStatus)
      }
    )
  }
}

module.exports = Sensors
