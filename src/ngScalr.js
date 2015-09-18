'use strict';

// sha256 is minified with this module,
// so just use it as sha256
angular.module('ngScalr', ['scalr.config', 'cb.x2js']).service('ngScalr', [
  '$http',
  '$q',
  '$log',
  '$window',
  'x2js',
  'SCALR_API_KEY',
  'SCALR_SECRET_KEY',
  'SCALR_API_ENDPOINT',
  function($http, $q, $log, $window, x2js, SCALR_API_KEY, SCALR_SECRET_KEY, SCALR_API_ENDPOINT) {
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

      var date = new $window.Date($window.Date.now());

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

    Scalr.prototype.call = function(category, action, data) {
      var deferred = $q.defer();

      // put any other farm methods here
      var methodMap = {
        'farm': {
          'launch': 'FarmLaunch',
          'clone': 'FarmClone',
          'getstats': 'FarmGetStats',
          'remove': 'FarmRemove',
          'terminate': 'FarmTerminate',
          'list': 'FarmList',
        },
        'orch': {
          'gvset': 'GlobalVariableSet',
          'gvlist': 'GlobalVariablesList'
        }
      };
      
      $http.get(buildUrl(methodMap[category][action], data), {
        transformResponse: function(data) {
          var json = x2js.xml_str2json(data);
          return json;
        }
      }).success(function(data, status, headerFunc, config, statusText) {
        deferred.resolve(data);
      }).error(function(data, status, headers, config) {
        deferred.reject({
          data: data,
          status: status,
          headers: headers,
          config: config
        });      
      });

      return deferred.promise;
    };

    return new Scalr();
  }
]);