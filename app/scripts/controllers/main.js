'use strict';

angular.module('yeomanTestApp')
  .controller('MainCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

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

    // get hours JSON
    JsonHourService.get(function(data){
      $scope.hourData = data;
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

      Date.prototype.getAdjustedWeekNumber = function(){
        // var weekNumber = x.getWeekNumber();
        // var adjustedWeekNumber = weekNumber - currentWeek + 8;
        // return adjustedWeekNumber;
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

      //DAY DATA --------------------------------------------------
      // current day (and day 14)
      $scope.dayNowImpressions = data.days[0].impressions;
      $scope.dayNowShares = data.days[0].shares;
      $scope.dayNowVisits = data.days[0].fbclicks;
      $scope.dayNowConversions = data.days[0].conversions;
      // previous day (and day 13)
      $scope.dayPreviousImpressions = data.days[1].impressions;
      $scope.dayPreviousShares = data.days[1].shares;
      $scope.dayPreviousVisits = data.days[1].fbclicks;
      $scope.dayPreviousConversions = data.days[1].conversions;
      // 14 day graph data
      for (var k = 0; k < 14; k++) {
        // slice days array to last 14 days, then reverse them to put in correct order for graph
        var slicedDays = data.days.slice(0,14).reverse();
        $scope.weekData.days[k].impressions = slicedDays[k].impressions;
        $scope.weekData.days[k].shares = slicedDays[k].shares;
        $scope.weekData.days[k].visits = slicedDays[k].fbclicks;
        $scope.weekData.days[k].conversions = slicedDays[k].conversions;
      }
      // deltas
      $scope.dayDeltaImpressions = Math.round(((data.days[0].impressions/data.days[1].impressions)*100)-100)+'%';
      $scope.dayDeltaShares = Math.round(((data.days[0].shares/data.days[1].shares)*100)-100)+'%';
      $scope.dayDeltaVisits = Math.round(((data.days[0].fbclicks/data.days[1].fbclicks)*100)-100)+'%';
      $scope.dayDeltaConversions = Math.round(((data.days[0].conversions/data.days[1].conversions)*100)-100)+'%';


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
      var weekData = $scope.weekData;

      //  for each day in day data
      for (var ii = 0; ii < data.days.length; ii++) {
        // if the day is within the last 8 weeks
        if (data.days[ii].day.getWeekNumber() >= currentWeek-7) {
          // iterate through every week to find one that matches
          for (var iii = 0; iii <weekData.weeks.length; iii++) {
            //  if day's current week number matches week we are looping through, add metrics to that week
            if (data.days[ii].day.getAdjustedWeekNumber() === iii+1) {
              weekData.weeks[iii].impressions = weekData.weeks[iii].impressions + data.days[ii].impressions;
              weekData.weeks[iii].shares = weekData.weeks[iii].shares + data.days[ii].shares;
              weekData.weeks[iii].fbclicks = weekData.weeks[iii].fbclicks + data.days[ii].fbclicks;
              weekData.weeks[iii].conversions = weekData.weeks[iii].conversions + data.days[ii].conversions;
            }
          }
        }
      }

      //  MONTH DATA -----------------------------------------
      //current month


      //  DAY GRAPH
      $scope.dayChart = {
        labels : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [$scope.weekData.days[0].impressions, $scope.weekData.days[1].impressions, $scope.weekData.days[2].impressions, $scope.weekData.days[3].impressions, $scope.weekData.days[4].impressions, $scope.weekData.days[5].impressions, $scope.weekData.days[6].impressions, $scope.weekData.days[7].impressions, $scope.weekData.days[8].impressions, $scope.weekData.days[9].impressions, $scope.weekData.days[10].impressions, $scope.weekData.days[11].impressions, $scope.weekData.days[12].impressions, $scope.weekData.days[13].impressions]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [$scope.weekData.days[0].shares, $scope.weekData.days[1].shares, $scope.weekData.days[2].shares, $scope.weekData.days[3].shares, $scope.weekData.days[4].shares, $scope.weekData.days[5].shares, $scope.weekData.days[6].shares, $scope.weekData.days[7].shares, $scope.weekData.days[8].shares, $scope.weekData.days[9].shares, $scope.weekData.days[10].shares, $scope.weekData.days[11].shares, $scope.weekData.days[12].shares, $scope.weekData.days[13].shares]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [$scope.weekData.days[0].visits, $scope.weekData.days[1].visits, $scope.weekData.days[2].visits, $scope.weekData.days[3].visits, $scope.weekData.days[4].visits, $scope.weekData.days[5].visits, $scope.weekData.days[6].visits, $scope.weekData.days[7].visits, $scope.weekData.days[8].visits, $scope.weekData.days[9].visits, $scope.weekData.days[10].visits, $scope.weekData.days[11].visits, $scope.weekData.days[12].visits, $scope.weekData.days[13].visits]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [$scope.weekData.days[0].conversions, $scope.weekData.days[1].conversions, $scope.weekData.days[2].conversions, $scope.weekData.days[3].conversions, $scope.weekData.days[4].conversions, $scope.weekData.days[5].conversions, $scope.weekData.days[6].conversions, $scope.weekData.days[7].conversions, $scope.weekData.days[8].conversions, $scope.weekData.days[9].conversions, $scope.weekData.days[10].conversions, $scope.weekData.days[11].conversions, $scope.weekData.days[12].conversions, $scope.weekData.days[13].conversions]
            }
          ],
        };
      $scope.dayOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 300,
        //Number - The scale starting value
        scaleStartValue : 1,
      };

      //  WEEK GRAPH
      $scope.weekChart = {
        labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [weekData.weeks[0].impressions, weekData.weeks[1].impressions, weekData.weeks[2].impressions, weekData.weeks[3].impressions, weekData.weeks[4].impressions, weekData.weeks[5].impressions, weekData.weeks[6].impressions, weekData.weeks[7].impressions, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [weekData.weeks[0].shares, weekData.weeks[1].shares, weekData.weeks[2].shares, weekData.weeks[3].shares, weekData.weeks[4].shares, weekData.weeks[5].shares, weekData.weeks[6].shares, weekData.weeks[7].shares, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [weekData.weeks[0].fbclicks, weekData.weeks[1].fbclicks, weekData.weeks[2].fbclicks, weekData.weeks[3].fbclicks, weekData.weeks[4].fbclicks, weekData.weeks[5].fbclicks, weekData.weeks[6].fbclicks, weekData.weeks[7].fbclicks, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [weekData.weeks[0].conversions, weekData.weeks[1].conversions, weekData.weeks[2].conversions, weekData.weeks[3].conversions, weekData.weeks[4].conversions, weekData.weeks[5].conversions, weekData.weeks[6].conversions, weekData.weeks[7].conversions, ]
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
        scaleStartValue : 1,
      };

      //  MONTH GRAPH
      $scope.monthChart = {
        labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [weekData.weeks[0].impressions, weekData.weeks[1].impressions, weekData.weeks[2].impressions, weekData.weeks[3].impressions, weekData.weeks[4].impressions, weekData.weeks[5].impressions, weekData.weeks[6].impressions, weekData.weeks[7].impressions, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [weekData.weeks[0].shares, weekData.weeks[1].shares, weekData.weeks[2].shares, weekData.weeks[3].shares, weekData.weeks[4].shares, weekData.weeks[5].shares, weekData.weeks[6].shares, weekData.weeks[7].shares, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [weekData.weeks[0].fbclicks, weekData.weeks[1].fbclicks, weekData.weeks[2].fbclicks, weekData.weeks[3].fbclicks, weekData.weeks[4].fbclicks, weekData.weeks[5].fbclicks, weekData.weeks[6].fbclicks, weekData.weeks[7].fbclicks, ]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [weekData.weeks[0].conversions, weekData.weeks[1].conversions, weekData.weeks[2].conversions, weekData.weeks[3].conversions, weekData.weeks[4].conversions, weekData.weeks[5].conversions, weekData.weeks[6].conversions, weekData.weeks[7].conversions, ]
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
        scaleStartValue : 1,
      };

    });
  });
