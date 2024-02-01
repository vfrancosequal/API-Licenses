/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

      bodyParser: (function _configureBodyParser(){
        var skipper = require('skipper');
        var middlewareFn = skipper({
          strict: true,
          limit: '50MB',
          maxWaitTimeBeforePassingControlToApp:100000,
          maxTimeToWaitForFirstFile:10000000,
          maxTimeToBuffer:10000000,
        });
        return middlewareFn;
      })(),

  },

};
