var getPnrStatusApiURL = "https://api.railwayapi.com/v2/pnr-status/pnr/<pnrno>/apikey/<apikey>/";
var getLiveTrainStatusURL = "https://api.railwayapi.com/v2/live/train/<trainnumber>/date/<dd-mm-yyyy>/apikey/<apikey>/";

function callRailwayApi(getPnrStatus, getTrainLiveStatus, apiKey, pnrNumber, trainNumber, dateString, $http, $scope) {
    var apiUrl = null;
    var responseJSON = {};
    if(getPnrStatus) {
        apiUrl = getApiUrl(getPnrStatusApiURL, true, false, apiKey, pnrNumber, null, null);
    } else if(getTrainLiveStatus) {
        apiUrl = getApiUrl(getLiveTrainStatusURL, false, true, apiKey, null, trainNumber, dateString);
    }
    if(null != apiUrl) {
        $http({
          method: 'GET',
          url: apiUrl,
          dataType: 'json',
          contentType: 'application/json'
      }).then(function(jsonData) {
        responseJSON = jsonData;
        console.log(responseJSON);
        if(getPnrStatus) {
            populatePnrDetails($scope, responseJSON);
        } else if(getTrainLiveStatus) {
            populateLiveTrainDetails($scope, responseJSON);
        }
    }, function (error){
        console.log('Error Occurred : ' + error);
    });
  }
}

function getApiUrl(url, getPnrStatus, getTrainLiveStatus, apiKey, pnrNumber, trainNumber, dateString) {
    var apiUrl = null;
    if(getPnrStatus) {
        apiUrl = url.replace("<pnrno>", pnrNumber).replace("<apikey>", apiKey);
        return apiUrl
    } else if(getTrainLiveStatus) {
        apiUrl = url.replace("<trainnumber>", trainNumber).replace("<dd-mm-yyyy>", dateString).replace("<apikey>", apiKey);
        return apiUrl
    }
    return null;
}

function populatePnrDetails($scope, responseJSON) {
    if(null != responseJSON) {
        $scope.showPnrDetailsFlag = false;
        $scope.passengersList = responseJSON.data.passengers;
        $scope.boardingStation = responseJSON.data.boarding_point.name;
        $scope.destinationStation = responseJSON.data.reservation_upto.name;
    } else {
        $scope.showPnrDetailsFlag = true;
    }
}

function populateLiveTrainDetails($scope, responseJSON) {
    if(null != responseJSON) {
        $scope.showLiveTrainFlag = false;
        $scope.startDate = responseJSON.data.start_date;
        $scope.currentStation = responseJSON.data.current_station.name;
        $scope.currentPosition = responseJSON.data.position;
        $scope.trainRoute = responseJSON.data.route;
    } else {
        $scope.showLiveTrainFlag = true;
    }
}