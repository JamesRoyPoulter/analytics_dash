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
      // deltas
      $scope.dayDeltaImpressions = Math.round(((data.days[0].impressions/data.days[1].impressions)*100)-100)+'%';
      $scope.dayDeltaShares = Math.round(((data.days[0].shares/data.days[1].shares)*100)-100)+'%';
      $scope.dayDeltaVisits = Math.round(((data.days[0].fbclicks/data.days[1].fbclicks)*100)-100)+'%';
      $scope.dayDeltaConversions = Math.round(((data.days[0].conversions/data.days[1].conversions)*100)-100)+'%';
      // 14 day graph data
      // day 12
      $scope.day12Impressions = data.days[2].impressions;
      $scope.day12Shares = data.days[2].shares;
      $scope.day12Visits = data.days[2].fbclicks;
      $scope.day12Conversions = data.days[2].conversions;
      // day 11
      $scope.day11Impressions = data.days[3].impressions;
      $scope.day11Shares = data.days[3].shares;
      $scope.day11Visits = data.days[3].fbclicks;
      $scope.day11Conversions = data.days[3].conversions;
      // day 10
      $scope.day10Impressions = data.days[4].impressions;
      $scope.day10Shares = data.days[4].shares;
      $scope.day10Visits = data.days[4].fbclicks;
      $scope.day10Conversions = data.days[4].conversions;
      // day 9
      $scope.day9Impressions = data.days[5].impressions;
      $scope.day9Shares = data.days[5].shares;
      $scope.day9Visits = data.days[5].fbclicks;
      $scope.day9Conversions = data.days[5].conversions;
      // day 8
      $scope.day8Impressions = data.days[6].impressions;
      $scope.day8Shares = data.days[6].shares;
      $scope.day8Visits = data.days[6].fbclicks;
      $scope.day8Conversions = data.days[6].conversions;
      // day 7
      $scope.day7Impressions = data.days[7].impressions;
      $scope.day7Shares = data.days[7].shares;
      $scope.day7Visits = data.days[7].fbclicks;
      $scope.day7Conversions = data.days[7].conversions;
      // day 6
      $scope.day6Impressions = data.days[8].impressions;
      $scope.day6Shares = data.days[8].shares;
      $scope.day6Visits = data.days[8].fbclicks;
      $scope.day6Conversions = data.days[8].conversions;
      // day 5
      $scope.day5Impressions = data.days[9].impressions;
      $scope.day5Shares = data.days[9].shares;
      $scope.day5Visits = data.days[9].fbclicks;
      $scope.day5Conversions = data.days[9].conversions;
      // day 4
      $scope.day4Impressions = data.days[10].impressions;
      $scope.day4Shares = data.days[10].shares;
      $scope.day4Visits = data.days[10].fbclicks;
      $scope.day4Conversions = data.days[10].conversions;
      // day 3
      $scope.day3Impressions = data.days[11].impressions;
      $scope.day3Shares = data.days[11].shares;
      $scope.day3Visits = data.days[11].fbclicks;
      $scope.day3Conversions = data.days[11].conversions;
      // day 2
      $scope.day2Impressions = data.days[12].impressions;
      $scope.day2Shares = data.days[12].shares;
      $scope.day2Visits = data.days[12].fbclicks;
      $scope.day2Conversions = data.days[12].conversions;
      // day 1
      $scope.day1Impressions = data.days[13].impressions;
      $scope.day1Shares = data.days[13].shares;
      $scope.day1Visits = data.days[13].fbclicks;
      $scope.day1Conversions = data.days[13].conversions;


      // WEEK DATA ------------------------------------------------
      // current week
      // impressions
      var lastSevenImpressions = 0;
      for (var i = 0; i < 6; i++) {
        lastSevenImpressions = lastSevenImpressions + data.days[i].impressions;
      }
      $scope.weekNowImpressions = lastSevenImpressions;

      // shares
      var lastSevenShares = 0;
      for (var j = 0; j < 6; j++) {
        lastSevenShares = lastSevenShares + data.days[j].shares;
      }
      $scope.weekNowShares = lastSevenShares;

      // visits
      var lastSevenVisits = 0;
      for (var k = 0; k < 6; k++) {
        lastSevenVisits = lastSevenVisits + data.days[k].fbclicks;
      }
      $scope.weekNowVisits = lastSevenVisits;

      // conversions
      var lastSevenConversions = 0;
      for (var l = 0; l < 6; l++) {
        lastSevenConversions = lastSevenConversions + data.days[l].conversions;
      }
      $scope.weekNowConversions = lastSevenConversions;

      // previous week
      // impressions
      var previousSevenImpressions = 0;
      for (var m = 7; m < 13; m++) {
        previousSevenImpressions = previousSevenImpressions + data.days[m].impressions;
      }
      $scope.weekPreviousImpressions = previousSevenImpressions;

      // shares
      var previousSevenShares = 0;
      for (var n = 7; n < 13; n++) {
        previousSevenShares = previousSevenShares + data.days[n].shares;
      }
      $scope.weekPreviousShares = previousSevenShares;

      // visits
      var previousSevenVisits = 0;
      for (var o = 7; o < 13; o++) {
        previousSevenVisits = previousSevenVisits + data.days[o].fbclicks;
      }
      $scope.weekPreviousVisits = previousSevenVisits;

      // conversions
      var previousSevenConversions = 0;
      for (var p = 7; p < 13; p++) {
        previousSevenConversions = previousSevenConversions + data.days[p].conversions;
      }
      $scope.weekPreviousConversions = previousSevenConversions;

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

      // if data.days[x].day.getWeekNumber matches currentWeek - x then push into week array?
      // or just then add to that week's totals.  push the days. better.

      for (var ii = 0; ii < data.days.length; ii++) {
        if (data.days[ii].day.getWeekNumber() >= currentWeek-7) {
          weekData.week8[0].impressions = weekData.week8[0].impressions + data.days[ii].impressions;
          weekData.week8[0].shares = weekData.week8[0].shares + data.days[ii].shares;
          weekData.week8[0].fbclicks = weekData.week8[0].fbclicks + data.days[ii].fbclicks;
          weekData.week8[0].conversions = weekData.week8[0].conversions + data.days[ii].conversions;
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
              data : [$scope.day1Impressions, $scope.day2Impressions, $scope.day3Impressions, $scope.day4Impressions, $scope.day5Impressions, $scope.day6Impressions, $scope.day7Impressions, $scope.day8Impressions, $scope.day9Impressions, $scope.day10Impressions, $scope.day11Impressions, $scope.day12Impressions, $scope.dayPreviousImpressions, $scope.dayNowImpressions]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [$scope.day1Shares, $scope.day2Shares, $scope.day3Shares, $scope.day4Shares, $scope.day5Shares, $scope.day6Shares, $scope.day7Shares, $scope.day8Shares, $scope.day9Shares, $scope.day10Shares, $scope.day11Shares, $scope.day12Shares, $scope.dayPreviousShares, $scope.dayNowShares]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [$scope.day1Visits, $scope.day2Visits, $scope.day3Visits, $scope.day4Visits, $scope.day5Visits, $scope.day6Visits, $scope.day7Visits, $scope.day8Visits, $scope.day9Visits, $scope.day10Visits, $scope.day11Visits, $scope.day12Visits, $scope.dayPreviousVisits, $scope.dayNowVisits]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [$scope.day1Conversions, $scope.day2Conversions, $scope.day3Conversions, $scope.day4Conversions, $scope.day5Conversions, $scope.day6Conversions, $scope.day7Conversions, $scope.day8Conversions, $scope.day9Conversions, $scope.day10Conversions, $scope.day11Conversions, $scope.day12Conversions, $scope.dayPreviousConversions, $scope.dayNowConversions]
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
        labels : [currentWeek-13, currentWeek -12,currentWeek-11,currentWeek-10,currentWeek-9,currentWeek-8,currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
        datasets : [
          {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#3C6CE6',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#3C6CE6',
              data : [$scope.day1Impressions, $scope.day2Impressions, $scope.day3Impressions, $scope.day4Impressions, $scope.day5Impressions, $scope.day6Impressions, $scope.day7Impressions, $scope.day8Impressions, $scope.day9Impressions, $scope.day10Impressions, $scope.day11Impressions, $scope.day12Impressions, $scope.dayPreviousImpressions, $scope.dayNowImpressions]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#F78F1E',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#F78F1E',
              data : [$scope.day1Shares, $scope.day2Shares, $scope.day3Shares, $scope.day4Shares, $scope.day5Shares, $scope.day6Shares, $scope.day7Shares, $scope.day8Shares, $scope.day9Shares, $scope.day10Shares, $scope.day11Shares, $scope.day12Shares, $scope.dayPreviousShares, $scope.dayNowShares]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#10AAE9',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#10AAE9',
              data : [$scope.day1Visits, $scope.day2Visits, $scope.day3Visits, $scope.day4Visits, $scope.day5Visits, $scope.day6Visits, $scope.day7Visits, $scope.day8Visits, $scope.day9Visits, $scope.day10Visits, $scope.day11Visits, $scope.day12Visits, $scope.dayPreviousVisits, $scope.dayNowVisits]
            },
            {
              fillColor : 'rgba(151,187,205,0)',
              strokeColor : '#f1c40f',
              pointColor : 'rgba(151,187,205,0)',
              pointStrokeColor : '#f1c40f',
              data : [$scope.day1Conversions, $scope.day2Conversions, $scope.day3Conversions, $scope.day4Conversions, $scope.day5Conversions, $scope.day6Conversions, $scope.day7Conversions, $scope.day8Conversions, $scope.day9Conversions, $scope.day10Conversions, $scope.day11Conversions, $scope.day12Conversions, $scope.dayPreviousConversions, $scope.dayNowConversions]
            }
          ],
        };
      $scope.weekOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 300,
        //Number - The scale starting value
        scaleStartValue : 1,
      };

    });
  });
