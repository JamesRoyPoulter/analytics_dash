'use strict';

angular.module('yeomanTestApp')
  .controller('MainCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService) {
    JsonClientService.get(function(data){
      $scope.clientName = data.client
    });
    var yoda = JsonHourService.get(function(data){
      console.log(data.hours[0].shares);
      console.log('data.hours[0].shares');
      yoda.data = data;
    });
    JsonDayService.get(function(daysData){
      $scope.clientFbclicks = daysData.days[0].fbclicks;
      $scope.lineChart = {
        labels : ['Impressions', 'Shares', 'Visits', 'Conversions', 'X'],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#e67e22',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#e67e22',
              data : [4, 3, 5, 4, 6]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [daysData.days[0].fbclicks, 3, 2, 5, 4]
            }
          ],
        };
    });
  });
