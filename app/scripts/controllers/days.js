'use strict';

angular.module('yeomanTestApp')
  .controller('DaysCtrl', function ($scope, JsonDayService, JsonHourService, JsonClientService, JsonWeekService) {

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

      //  convert all date strings into date time objects
      for (var a = 0; a < data.days.length; a++) {
        var splitDate;
        splitDate = data.days[a].day.split(/\-|\s/);
        data.days[a].day = new Date(splitDate.slice(0,3).join('/')+' '+splitDate[3]);
      }

      // get all day data for DOM and graphs
      var dayData = $scope.weekData.days;
      var lines = {};
      // loop that iterates over all properties of days object in JSON
      for (var i in dayData[0]) {
        var b = i+'DayNow';
        var c = i+'DayDelta';
        $scope[b] = data.days[0][i];
        // 14 day graph data
        for (var k = 0; k < 14; k++) {
          // slice days array to last 14 days, then reverse them to put in correct order for graph
          var slicedDays = data.days.slice(0,14).reverse();
          $scope.weekData.days[k][i] = slicedDays[k][i];
        }
        // deltas
        $scope[c] = Math.round(((data.days[0][i]/data.days[1][i])*100)-100)+'%';
        // all the graph workings
        var y = i +'Options';
        lines[i] = [];
        for ( var x = 0; x < 14; x++) {
          lines[i].push(dayData[x][i]);
        }
        // the actual graph data
        $scope[i] = {
          labels : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
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
          scaleOverride : true,
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










