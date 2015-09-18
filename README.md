# angular-scalr

An Angular service to access [Scalr's](http://www.scalr.com/) API.

Makes use of libraries from [CryptoJS](https://code.google.com/p/crypto-js/) for auth.

At the beginning of your Angular file, include these lines:

```
angular.module('scalr.config', [])
.constant('SCALR_API_KEY', "yourapikey")
.constant('SCALR_SECRET_KEY', "yourreallygiganticlongscalrkey")
.constant('SCALR_API_ENDPOINT', "http://yourapiendpoint/api/api.php");
```
