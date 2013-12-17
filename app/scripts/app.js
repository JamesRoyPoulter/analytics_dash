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
      .when('/days', {
        templateUrl: 'views/days.html',
        controller: 'MainCtrl'
      })
      .when('/weeks', {
        templateUrl: 'views/weeks.html',
        controller: 'MainCtrl'
      })
      .when('/months', {
        templateUrl: 'views/months.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/days'
      });
  });