'use strict';

// sha256 is minified with this module,
// so just use it as sha256
angular.module('ngScalr', ['scalr.config']).service('ngScalr', [
  '$http',
  '$q',
  '$log',
  'SCALR_API_KEY',
  'SCALR_SECRET_KEY',
  'SCALR_API_ENDPOINT',
  function($http, $q, $log, SCALR_API_KEY, SCALR_SECRET_KEY, SCALR_API_ENDPOINT) {
    function Scalr() {

    }

    // input: nothing
    // output: timestamp
    var buildTimestamp = function() {
      var formatZeros = function(num, milli) {
        if (!milli) {
          return (num < 10 ? '0' + num.toString() : num.toString());
        } else {
          if (num < 100) {
            return (num < 10 ? '00' + num.toString() : '0' + num.toString());
          } else {
            return num.toString();
          }
        }
      }

      var date = new Date(Date.now());

      var year = date.getFullYear().toString();
      var milliseconds = formatZeros(date.getMilliseconds(), true);
      var hours = formatZeros(date.getHours());
      var minutes = formatZeros(date.getMinutes());
      var seconds = formatZeros(date.getSeconds());
      var month = formatZeros(date.getMonth() + 1);
      var date = formatZeros(date.getDate());

      var timestamp = '' + year + '-' + month + '-' + date + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + 'Z';

      return timestamp;
    };

    // building a signature based on the action and API key
    var buildSignature = function(action) {
      var stringToEncrypt = action + ':' + 
                            SCALR_API_KEY + ':' + 
                            buildTimestamp();
      var hash = CryptoJS.HmacSHA256(stringToEncrypt, SCALR_SECRET_KEY);
      var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
      return hashInBase64;
    };

    var buildUrl = function(action, opts) {
      var url = SCALR_API_ENDPOINT + '?Action=' + action;
      for (var param in opts) {
        if (opts.hasOwnProperty(param)) {
          url = url + '&' + param + '=' + opts[param];
        }
      }
      url = url + '&Version=2.3.0' +
                  '&AuthVersion=3' +
                  '&KeyID=' + SCALR_API_KEY + 
                  '&TimeStamp=' + encodeURIComponent(buildTimestamp()) + 
                  '&Signature=' + buildSignature(action);
      return url;
    };

    Scalr.prototype.farm = function(action, data) {
      var methodMap = {
        'launch': 'FarmLaunch',
        'clone': 'FarmClone'
      };
    };

    Scalr.prototype.test = function() {
      $log.log('lmao');
      $log.log(buildTimestamp());
      $log.log(buildSignature('FarmClone'));
      $log.log(buildUrl('FarmLaunch', {'FarmID': '123'}))
    };

    return new Scalr();
  }
]);