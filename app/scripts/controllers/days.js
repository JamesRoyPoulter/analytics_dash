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

      //  DAY GRAPHS

      var dayData = $scope.weekData.days;
      var lines = {};
      // $scope.dayChart = {};
      // $scope.dayOptions = {};
      for (var i in dayData[0]) {
        if (i === "impressions") {
        lines[i] = [];
        for ( var x = 0; x < 14; x++) {
          lines[i].push(dayData[x][i]);
        }

        //  graph
        console.log(i);
        console.log(lines);
        console.log(lines[i]);
        $scope.chartLine = {
          labels : ['1','2','3','4','5','6','7','8','9','10','11','12','13','14'],
          datasets : [
            {
                fillColor : 'rgba(151,187,205,0)',
                strokeColor : '#3C6CE6',
                pointColor : 'rgba(151,187,205,0)',
                pointStrokeColor : '#3C6CE6',
                data : lines[i]
              },
            ],
          };
        $scope.chartOptions = {
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
      } // end of dayData[0] loop
    });
  });