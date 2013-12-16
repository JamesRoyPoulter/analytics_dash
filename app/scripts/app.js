'use strict';

angular.module('yeomanTestApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute',
  'angles',
  'jsonDayService',
  'jsonHourService',
  'jsonClientService',
  'jsonWeekService'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });