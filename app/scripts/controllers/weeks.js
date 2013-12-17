'use strict';

angular.module('yeomanTestApp')
  .controller('WeeksCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

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

      // prototype function to get week number from dates
      Date.prototype.getWeekNumber = function(){
          var d = new Date(+this);
          d.setHours(0,0,0);
          d.setDate(d.getDate()+4-(d.getDay()||7));
          return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        };

      // prototype function to get adjusted week number from dates
      Date.prototype.getAdjustedWeekNumber = function(){
        var d = new Date(+this);
        d.setHours(0,0,0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        var test3 = Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        return test3 - currentWeek + 8;
      };

      //  convert all date strings into date time objects
      for (var a = 0; a < data.days.length; a++) {
        var splitDate;
        splitDate = data.days[a].day.split(/\-|\s/);
        data.days[a].day = new Date(splitDate.slice(0,3).join('/')+' '+splitDate[3]);
      }

      // WEEK DATA ------------------------------------------------
      $scope.weekNowImpressions = 0;
      $scope.weekNowShares = 0;
      $scope.weekNowVisits = 0;
      $scope.weekNowConversions = 0;
      $scope.weekPreviousImpressions = 0;
      $scope.weekPreviousShares = 0;
      $scope.weekPreviousVisits = 0;
      $scope.weekPreviousConversions = 0;
      // current week
      for (var i = 0; i < 6; i++) {
        $scope.weekNowImpressions = $scope.weekNowImpressions + data.days[i].impressions;
        $scope.weekNowShares = $scope.weekNowShares + data.days[i].shares;
        $scope.weekNowVisits = $scope.weekNowVisits + data.days[i].fbclicks;
        $scope.weekNowConversions = $scope.weekNowConversions + data.days[i].conversions;
      }
      // previous week
      for (var j = 7; j < 13; j++) {
        $scope.weekPreviousImpressions = $scope.weekPreviousImpressions + data.days[j].impressions;
        $scope.weekPreviousShares = $scope.weekPreviousShares + data.days[j].shares;
        $scope.weekPreviousVisits = $scope.weekPreviousVisits + data.days[j].fbclicks;
        $scope.weekPreviousConversions = $scope.weekPreviousConversions + data.days[j].conversions;
      }

      // deltas
      $scope.weekDeltaImpressions = Math.round((($scope.weekNowImpressions/$scope.weekPreviousImpressions)*100)-100)+'%';
      $scope.weekDeltaShares = Math.round((($scope.weekNowShares/$scope.weekPreviousShares)*100)-100)+'%';
      $scope.weekDeltaVisits = Math.round((($scope.weekNowVisits/$scope.weekPreviousVisits)*100)-100)+'%';
      $scope.weekDeltaConversions = Math.round((($scope.weekNowConversions/$scope.weekPreviousConversions)*100)-100)+'%';

      // 8 week graph data
      // get current week
      var currentDate = new Date();
      var currentWeek = currentDate.getWeekNumber();
      var weekData = $scope.weekData.weeks;

      //  for each day in day data
      for (var ii = 0; ii < data.days.length; ii++) {
        // if the day is within the last 8 weeks
        if (data.days[ii].day.getWeekNumber() >= currentWeek-7) {
          // iterate through every week to find one that matches
          for (var iii = 0; iii <weekData.length; iii++) {
            //  if day's current week number matches week we are looping through, add metrics to that week
            if (data.days[ii].day.getAdjustedWeekNumber() === iii+1) {
              weekData[iii].impressions = weekData[iii].impressions + data.days[ii].impressions;
              weekData[iii].shares = weekData[iii].shares + data.days[ii].shares;
              weekData[iii].fbclicks = weekData[iii].fbclicks + data.days[ii].fbclicks;
              weekData[iii].conversions = weekData[iii].conversions + data.days[ii].conversions;
            }
          }
        }
      }

      //  WEEK GRAPH
      $scope.weekChart = {
        labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [weekData[0].impressions, weekData[1].impressions, weekData[2].impressions, weekData[3].impressions, weekData[4].impressions, weekData[5].impressions, weekData[6].impressions, weekData[7].impressions, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [weekData[0].shares, weekData[1].shares, weekData[2].shares, weekData[3].shares, weekData[4].shares, weekData[5].shares, weekData[6].shares, weekData[7].shares, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [weekData[0].fbclicks, weekData[1].fbclicks, weekData[2].fbclicks, weekData[3].fbclicks, weekData[4].fbclicks, weekData[5].fbclicks, weekData[6].fbclicks, weekData[7].fbclicks, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [weekData[0].conversions, weekData[1].conversions, weekData[2].conversions, weekData[3].conversions, weekData[4].conversions, weekData[5].conversions, weekData[6].conversions, weekData[7].conversions, ]
            }
          ],
        };
      $scope.weekOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 2500,
        //Number - The scale starting value
        scaleStartValue : 0,
      };
      console.log($scope.weekChart);
    });
  });
