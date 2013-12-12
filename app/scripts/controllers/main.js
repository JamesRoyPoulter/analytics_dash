'use strict';

angular.module('yeomanTestApp')
  .controller('MainCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService) {

    // get client JSON
    JsonClientService.get(function(data){
      $scope.clientName = data.client;
      $scope.clientType = data.type;
      $scope.clientURL = data.url;
    });

    // get hours JSON
    JsonHourService.get(function(data){
      $scope.hourData = data;
    });

    // get days JSON
    JsonDayService.get(function(data){

      // GET ALL DATA
      //DAY DATA
      // current day
      $scope.currentDayImpressions = data.days[0].impressions;
      $scope.currentDayShares = data.days[0].shares;
      $scope.currentDayVisits = data.days[0].fbclicks;
      $scope.currentDayConversions = data.days[0].conversions;
      // previous day
      $scope.previousDayImpressions = data.days[1].impressions;
      $scope.previousDayShares = data.days[1].shares;
      $scope.previousDayVisits = data.days[1].fbclicks;
      $scope.previousDayConversions = data.days[1].conversions;
      // deltas
      $scope.deltaImpressions = Math.round(((data.days[0].impressions/data.days[1].impressions)*100)-100)+'%';
      $scope.deltaShares = Math.round(((data.days[0].shares/data.days[1].shares)*100)-100)+'%';
      $scope.deltaVisits = Math.round(((data.days[0].fbclicks/data.days[1].fbclicks)*100)-100)+'%';
      $scope.deltaConversions = Math.round(((data.days[0].conversions/data.days[1].conversions)*100)-100)+'%';
      // 14 day graph
      var lastFourteenImpressions = 0;
      for (var i = 0; i < 6; i++) {
        lastFourteenImpressions = lastFourteenImpressions + data.days[i].impressions;
      }
      $scope.fourteenImpressions = lastFourteenImpressions;

      // var lastFourteenShares = 0;
      // $scope.fourteenShares = lastFourteenShares();


      // var lastFourteenVisits = 0;
      // $scope.fourteenVisits = lastFourteenVisits();


      // var lastFourteenConversions = 0;
      // $scope.fourteenConversions = lastFourteenConversions();

      //WEEK DATA
      //current week


      //current month

      $scope.clientFbclicks = data.days[0].fbclicks;
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
              data : [data.days[1].fbclicks, 3, 2, 5, 4]
            }
          ],
        };
      $scope.options = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 1,
        //Number - The scale starting value
        scaleStartValue : 0,
      };
    });
  });
