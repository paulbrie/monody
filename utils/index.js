'use strict';

/**
 * builds a  standard reponse object for monody sensors.
 * 
 * @param {boolean|string} status - indicaties the result of the operation
 * @param {object} [data={}]- the data returned by the sensor if any
 * @param {string} [msg=""] - msg in case the sensor failed to retreive data
 * @param {*} [extra] - extra data 
 * @returns {Object}
 */

function response(status, data, msg, extra, taskStatus) {
  return { 
    status, 
    data: data || {}, 
    msg: msg || '',
    extra: extra || null,
    taskStatus: taskStatus || null,
  };
} 

module.exports = {
  response
}