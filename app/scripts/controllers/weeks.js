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

      // WEEK DATA -----------------------------------------
      // get all day data for DOM and graphs
      var weekData = $scope.weekData.weeks;
      var lines = {};
      // loop that iterates over all properties of days object in JSON
      for (var i in weekData[0]) {
        // current week
        var b = i+'WeekNow';
        $scope[b] = 0;
        for (var ii = 0; ii < 6; ii++) {
          $scope[b] = $scope[b] + data.days[ii][i];
        }
        // previous week
        var weekPrevious = 0;
        for (var j = 7; j < 13; j++) {
          weekPrevious = weekPrevious + data.days[j][i];
        }
        // deltas
        var d = i+'WeekDelta';
        $scope[d] = Math.round((($scope[b]/weekPrevious)*100)-100)+'%';
        // all the graph workings
        // get current week
        var currentDate = new Date();
        var currentWeek = currentDate.getWeekNumber();
        //  for each day in day data
        for (var ii = 0; ii < data.days.length; ii++) {
          // if the day is within the last 8 weeks
          if (data.days[ii].day.getWeekNumber() >= currentWeek-7) {
            // iterate through every week to find one that matches
            for (var iii = 0; iii <weekData.length; iii++) {
              //  if day's current week number matches week we are looping through, add metrics to that week
              if (data.days[ii].day.getAdjustedWeekNumber() === iii+1) {
                weekData[iii][i] = weekData[iii][i] + data.days[ii][i];
              }
            }
          }
        }

        // set individual line arrays to take graph metrics
        lines[i] = [];
        // push metrics into array
        for ( var x = 0; x < 8; x++) {
          lines[i].push(weekData[x][i]);
        }
        // set graph reference for dom
        var y = i +'Options';
        //  WEEK GRAPH
        $scope[i] = {
          labels : [currentWeek-7,currentWeek-6,currentWeek-5,currentWeek-4,currentWeek-3,currentWeek-2,currentWeek-1,currentWeek],
          datasets : [
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#e67e22',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#e67e22',
                data : lines[i]
              }
            ],
          };
        // the actul graph options
        $scope[y] = {
          scaleLineColor : 'rgba(0,0,0,.1)',
          // scaleOverride : true,
          //Number - The number of steps in a hard coded scale
          scaleSteps : 6,
          //Number - The value jump in the hard coded scale
          scaleStepWidth : 300,
          //Number - The scale starting value
          scaleStartValue : 0,
        };
      }
    });
  });
