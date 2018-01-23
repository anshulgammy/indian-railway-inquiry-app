var app = angular.module("railwayApp", ["ngRoute"]);
var apiKey = "";

// Routing templates to home page as per the choice clicked on index.html
app.config(function($routeProvider) {
    $routeProvider
    .when("/formEntry", {
        templateUrl : "./templates/formEntry.html",
        controller : "makeApiCallCtrl"
    })
    .when("/liveTrainStatus", {
        templateUrl : "./templates/liveTrainStatus.html",
        controller : "liveTrainStatusCtrl"
    });
});

// Inital Controller. It reads api key value from apiKey.json file.
app.controller('initialController', function($scope, $http) {
    $http({
      method: 'GET',
      url: 'scripts/apiKey.json',
      dataType: 'json',
      contentType: 'application/json'
  }).then(function(jsonData) {
    console.log(jsonData);
    apiKey = jsonData.data.railwayApiKey;
}, function (error){
    console.log('Error Occurred : ' + error);
});
});

// Controller for PNR status.
app.controller("makeApiCallCtrl", function ($scope, $http) {
    $scope.showPnrDetailsFlag = true;
    $scope.showPnrStatus = function() {
        var pnrNumber = $scope.pnrNumber;
        if(null != pnrNumber) {
            callRailwayApi(true, false, apiKey, pnrNumber, null, null, $http, $scope);
        }
    }
});

// Controller for Live Train results. 
app.controller("liveTrainStatusCtrl", function ($scope, $http) {
    $scope.showLiveTrainFlag = true;
    $scope.showTrainDetails = function() {
        var trainNumber = $scope.trainNumber;
        var dateString = moment($scope.dateString).format('DD-MM-YYYY');
        if(null != trainNumber) {
            callRailwayApi(false, true, apiKey, null, trainNumber, dateString, $http, $scope);
        }
    }
});