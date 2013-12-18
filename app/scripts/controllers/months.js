'use strict';

angular.module('yeomanTestApp')
  .controller('MonthsCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

    // get client JSON
    JsonClientService.get(function(data){
      $scope.clientName = data.client;
      $scope.clientType = data.type;
      $scope.clientURL = data.url;
    });

    //  get week JSON
    JsonWeekService.get(function(data){
      $scope.weekData = data;
    });

    // get days JSON
    JsonDayService.get(function(data){

      //  prototype function to get adjusted month number from dates
      Date.prototype.getAdjustedMonthNumber = function(){
        var d = new Date(+this);
        var month = d.getMonth();
        return month - currentMonth + 6;
      };

      //  convert all date strings into date time objects
      for (var a = 0; a < data.days.length; a++) {
        var splitDate;
        splitDate = data.days[a].day.split(/\-|\s/);
        data.days[a].day = new Date(splitDate.slice(0,3).join('/')+' '+splitDate[3]);
      }

      //  MONTH DATA -----------------------------------------
      $scope.monthNowImpressions = 0;
      $scope.monthNowShares = 0;
      $scope.monthNowVisits = 0;
      $scope.monthNowConversions = 0;
      $scope.monthPreviousImpressions = 0;
      $scope.monthPreviousShares = 0;
      $scope.monthPreviousVisits = 0;
      $scope.monthPreviousConversions = 0;
      // current month
      for (var m = 0; m < 27; m++) {
        $scope.monthNowImpressions = $scope.monthNowImpressions + data.days[m].impressions;
        $scope.monthNowShares = $scope.monthNowShares + data.days[m].shares;
        $scope.monthNowVisits = $scope.monthNowVisits + data.days[m].fbclicks;
        $scope.monthNowConversions = $scope.monthNowConversions + data.days[m].conversions;
      }
      // previous week
      for (var l = 28; l < 55; l++) {
        $scope.monthPreviousImpressions = $scope.monthPreviousImpressions + data.days[l].impressions;
        $scope.monthPreviousShares = $scope.monthPreviousShares + data.days[l].shares;
        $scope.monthPreviousVisits = $scope.monthPreviousVisits + data.days[l].fbclicks;
        $scope.monthPreviousConversions = $scope.monthPreviousConversions + data.days[l].conversions;
      }

      // deltas
      $scope.monthDeltaImpressions = Math.round((($scope.monthNowImpressions/$scope.monthPreviousImpressions)*100)-100)+'%';
      $scope.monthDeltaShares = Math.round((($scope.monthNowShares/$scope.monthPreviousShares)*100)-100)+'%';
      $scope.monthDeltaVisits = Math.round((($scope.monthNowVisits/$scope.monthPreviousVisits)*100)-100)+'%';
      $scope.monthDeltaConversions = Math.round((($scope.monthNowConversions/$scope.monthPreviousConversions)*100)-100)+'%';

      // 6 month graph data
      // get current month
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();
      var monthData = $scope.weekData.months;

      //  for each day in day data
      for (var iv = 0; iv < data.days.length; iv++) {
        // if the day is within the last 6 months
        if (data.days[iv].day.getMonth() >= currentMonth-6) {
          // iterate through every month to find one that matches
          for (var v = 0; v <monthData.length; v++) {
            //  if day's current month number matches month we are looping through, add metrics to that month
            if (data.days[iv].day.getAdjustedMonthNumber() === v+1) {
              monthData[v].impressions = monthData[v].impressions + data.days[iv].impressions;
              monthData[v].shares = monthData[v].shares + data.days[iv].shares;
              monthData[v].fbclicks = monthData[v].fbclicks + data.days[iv].fbclicks;
              monthData[v].conversions = monthData[v].conversions + data.days[iv].conversions;
            }
          }
        }
      }

      //  MONTH GRAPH
      $scope.monthChart = {
        labels : [currentMonth-4,currentMonth-3,currentMonth-2,currentMonth-1,currentMonth,currentMonth+1],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [monthData[0].impressions, monthData[1].impressions, monthData[2].impressions, monthData[3].impressions, monthData[4].impressions, monthData[5].impressions, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [monthData[0].shares, monthData[1].shares, monthData[2].shares, monthData[3].shares, monthData[4].shares, monthData[5].shares, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [monthData[0].fbclicks, monthData[1].fbclicks, monthData[2].fbclicks, monthData[3].fbclicks, monthData[4].fbclicks, monthData[5].fbclicks, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [monthData[0].conversions, monthData[1].conversions, monthData[2].conversions, monthData[3].conversions, monthData[4].conversions, monthData[5].conversions, ]
            }
          ],
        };
      $scope.monthOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 10000,
        //Number - The scale starting value
        scaleStartValue : 0,
      };
    });
  });
