'use strict';

angular.module('jsonDayService', ['ngResource'])
.factory('JsonDayService', function($resource) {
  return $resource('data/days.json');
});

angular.module('jsonHourService', ['ngResource'])
.factory('JsonHourService', function($resource) {
  return $resource('data/hours.json');
});

angular.module('jsonClientService', ['ngResource'])
.factory('JsonClientService', function($resource) {
  return $resource('data/client.json');
});