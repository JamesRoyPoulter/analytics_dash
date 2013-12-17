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
        controller: 'DaysCtrl'
      })
      .when('/weeks', {
        templateUrl: 'views/weeks.html',
        controller: 'WeeksCtrl'
      })
      .when('/months', {
        templateUrl: 'views/months.html',
        controller: 'MonthsCtrl'
      })
      .otherwise({
        redirectTo: '/days'
      });
  });