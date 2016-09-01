const cmd = require('node-cmd');
const http = require('http');
const response = require('../utils').response;

console.log(response(true));

/*function parseHttpResponse (response) {
  console.log(response);
  
  var str = '';

  response.on('data', (chunk) => {
    console.log('chunk', str);
    str += chunk;
  });

  response.on('end', () => {
    console.log('end', str);
    return str;
  });
}*/

class Sensors {
  
  static http(cb, options) {
    http.request(options, function(res2) {
      console.log(res);
      cb(response(true, res), 'http');
    }).on('error', (err) => {
      cb(response(false, {}, 'http.request error', err), 'http');
    }).end();
  }
  
  /**
   * returns total, free, and available memory
   * @param cb - callback(data, name)
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
        cb({
          total: get(data, 0),
          free: get(data, 1),
          available: get(data, 2),
        }, 'mem');
      });
  }

  /**
   * returns cpu load (user + system)
   * @param cb - callback(data, name)
   */
  static cpu(cb) {
    cmd.get(
      // we need two iterations from top (first one seems to be dummy)
      "top - bn2 | grep ' id,'",
      (data) => {
        const patt = /(\d{1,3}\.\d) id,/i;
        const line2 = data.split("\n")[1];
        // then we take the second occurence/line
        cb(parseFloat((100 - line2.match(patt)[1]).toFixed(1)), 'cpu');
      }
    );
  }

  /**
   * returns disk usage
   * @param cb - callback(data, name)
   * @param partName mount point
   */
  static disk(cb, partName) {
    cmd.get(
      "df -h | grep " + partName,
      (data) => {
        const patt = /([0-9]{1,3})%/i;
        cb({ free: parseFloat(data.match(patt)[0])}, 'disk ' + partName);
      }
    );
  }
  
  /**
   * returns file size
   * @param cb - callback(data, fileName)
   */
  static fileInfo(callback, fileName) {
    cmd.get(
      "ls -la " + fileName,
      (data) => {
        callback({ size: data.split(" ")[4]}, 'fileInfo ' + fileName);
      }
    );
  }
}

module.exports = Sensors;