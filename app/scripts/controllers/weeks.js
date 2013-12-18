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
      // get all day data for DOM and graphs
      var dayData = $scope.weekData.days;
      var lines = {};
      // loop that iterates over all properties of days object in JSON
      for (var i in dayData[0]) {
        var b = i+'WeekNow';
        var c = i+'WeekPrevious';
        var d = i+'WeekDelta';
        $scope[b] = 0;
        $scope[c] = 0;
        // current week
        for (var ii = 0; ii < 6; ii++) {
          $scope[b] = $scope[b] + data.days[ii][i];
        }
        // previous week
        for (var j = 7; j < 13; j++) {
          $scope[c] = $scope[c] + data.days[j][i];
        }
        // deltas
        $scope[d] = Math.round((($scope[b]/$scope[c])*100)-100)+'%';
        // all the graph workings
        // get current week
        var currentDate = new Date();
        var currentWeek = currentDate.getWeekNumber();
        var weekData = $scope.weekData.weeks;
        // set graph reference for dom
        var y = i +'Data';
        // set individual line arrays to take graph metrics
        lines[i] = [];
        // push metrics into array
        for ( var x = 0; x < 14; x++) {
          lines[i].push(dayData[x][i]);
        }
        //  for each day in day data
        for (var ii = 0; ii < data.days.length; ii++) {
          // if the day is within the last 8 weeks
          if (data.days[ii].day.getWeekNumber() >= currentWeek-7) {
            // iterate through every week to find one that matches
            for (var iii = 0; iii <weekData.length; iii++) {
              //  if day's current week number matches week we are looping through, add metrics to that week
              if (data.days[ii].day.getAdjustedWeekNumber() === iii+1) {
                weekData[iii][i] = weekData[iii][i] + data.days[ii][i]
              }
            }
          }
        }
        console.log(lines[i]);
        console.log(weekData[iii][i]);
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
      }


      console.log($scope.weekChart);
    });
  });
