/**
 * callback function for all sensors
 *
 * @callback requestCallback
 * @param {object} responseData
 * @param {string} responseTag
 */

const cmd = require('node-cmd');
const http = require('http');
const response = require('../utils').response;

class Sensors {
  
  static http(cb, options) {
    http.request(options, function(res) {
      cb(response(true, res), 'http');
    }).on('error', (err) => {
      cb(response(false, {}, 'http.request error', err), 'http');
    }).end();
  }
  
  /**
   * returns total, free, and available memory
   * @param {requestCallback} cb
   */
  static mem(cb) {
    
    function get(data, lineNumber) {
      const line = data.split("\n")[lineNumber];
      const parts = line.split(" ");
      return parts[parts.length - 2] / 1024;
    }

    cmd.get(
      'cat /proc/meminfo',
      (data) => {
        
        const responseData = {
          total: get(data, 0),
          free: get(data, 1),
          available: get(data, 2)
        };
        
        cb(response(true, responseData), 'mem');
      });
  }

  /**
   * returns cpu load (user + system)
   * @param {requestCallback} cb
   */
  static cpu(cb) {
    cmd.get(
      // we need two iterations from top (first one seems to be dummy)
      "top - bn2 | grep ' id,'",
      (data) => {
        const patt = /(\d{1,3}\.\d) id,/i;
        const line2 = data.split("\n")[1];
        // then we take the second occurence/line
        const resData = {
          load: parseFloat((100 - line2.match(patt)[1]).toFixed(1))
        }
        
        cb(response(true, resData), 'cpu');
      }
    );
  }

  /**
   * returns disk usage
   * @param {requestCallback} cb
   * @param {string} partName - mount point
   */
  static disk(cb, partName) {
    cmd.get(
      "df -h | grep " + partName,
      (data) => {
        
        const patt = /([0-9]{1,3})%/i;
        const resData = {
          free: parseFloat(data.match(patt)[0])  
        }
        
        cb(response(true, resData), 'disk ' + partName);
      }
    );
  }
  
  /**
   * returns file size
   * @param {requestCallback} cb
   * @param {string} fileName
   */
  static fileInfo(callback, fileName) {
    cmd.get(
      "ls -la " + fileName,
      (data) => {
        
        const resData = {
          size: data.split(" ")[4]
        }
        
        callback(response(true, resData), `fileInfo ${fileName}`);
      }
    );
  }
}

module.exports = Sensors;