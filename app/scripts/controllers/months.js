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

      //  MONTH DATA --------------------------------
      // get all day data for DOM and graphs
      var monthData = $scope.weekData.weeks;
      var lines = {};
      // get current month
      var currentDate = new Date();
      var currentMonth = currentDate.getMonth();
      // loop that iterates over all properties of days object in JSON
      for (var i in monthData[0]) {
        // current month
        var b = i+'MonthNow';
        $scope[b] = 0;
        for (var ii = 0; ii < 27; ii++) {
          $scope[b] = $scope[b] + data.days[ii][i];
        }
        // previous month
        var monthPrevious = 0;
        for (var j = 28; j < 55; j++) {
          monthPrevious = monthPrevious + data.days[j][i];
        }
        // deltas
        var d = i+'MonthDelta';
        $scope[d] = Math.round((($scope[b]/monthPrevious)*100)-100)+'%';

        // 6 month graph data
        //  for each day in day data
        for (var ii = 0; ii < data.days.length; ii++) {
          // if the day is within the last 6 months
          if (data.days[ii].day.getMonth() >= currentMonth-6) {
            // iterate through every month to find one that matches
            for (var iii = 0; iii < 7; iii++) {
              //  if day's current month number matches month we are looping through, add metrics to that month
              if (data.days[ii].day.getAdjustedMonthNumber() === iii+1) {
                monthData[iii][i] = monthData[iii][i] + data.days[ii][i];

              }
            }
          }
        }
        // set individual line arrays to take graph metrics
        lines[i] = [];
        // push metrics into array
        for ( var x = 0; x < 6; x++) {
          lines[i].push(monthData[x][i]);
        }
        // set graph reference for dom
        var y = i +'Options';
        //  MONTH GRAPH
        $scope[i] = {
          labels : [currentMonth-4,currentMonth-3,currentMonth-2,currentMonth-1,currentMonth,currentMonth+1],
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

      // main graph outside of loop
      var mainGraphLines = [];
      for (var i in lines) {
        mainGraphLines.push(lines[i]);
      }
      console.log(mainGraphLines[0]);
      $scope.mainData = {
        labels : [currentMonth-4,currentMonth-3,currentMonth-2,currentMonth-1,currentMonth,currentMonth+1],
        datasets : [
            {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#3C6CE6',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#3C6CE6',
                data : mainGraphLines[0]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#F78F1E',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#F78F1E',
                data : mainGraphLines[1]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#10AAE9',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#10AAE9',
                data : mainGraphLines[2]
              },
              {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#f1c40f',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#f1c40f',
                data : mainGraphLines[3]
              }
          ],
        };
      $scope.mainOptions = {
        scaleLineColor : 'rgba(0,0,0,.1)',
        // scaleOverride : true,
        //Number - The number of steps in a hard coded scale
        scaleSteps : 6,
        //Number - The value jump in the hard coded scale
        scaleStepWidth : 300,
        //Number - The scale starting value
        scaleStartValue : 0,
      };
    });
  });
