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

      // prototype function to get adjusted week number from dates
      Date.prototype.getAdjustedWeekNumber = function(){
        var d = new Date(+this);
        d.setHours(0,0,0);
        d.setDate(d.getDate()+4-(d.getDay()||7));
        var test3 = Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
        return test3 - currentWeek + 8;
      };

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

      //DAY DATA --------------------------------------------------
      // current day
      $scope.dayNowImpressions = data.days[0].impressions;
      $scope.dayNowShares = data.days[0].shares;
      $scope.dayNowVisits = data.days[0].fbclicks;
      $scope.dayNowConversions = data.days[0].conversions;
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
        scaleStartValue : 0,
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
