'use strict';

var stravaApp = angular.module('stravaApp', []);

// Main app controller.
stravaApp.controller('StravaController', function StravaController($scope, $http) {

    $scope.login = function () {
        $http.get('/login').success(function (data) {
            window.location.replace(data);
        });
    };
});

stravaApp.controller('StravaUserController', function StravaUserController($scope, $http) {

    $scope.user = "Loading";

    $scope.athlete_info = null;

    $scope.loadUser = function() {
        $http.get('/athlete').success(function (data) {
            $scope.athlete_info = data;
            $scope.user = data.name
        });
    };

    $scope.rides = null
    $scope.privateRides = function() {
        $http.get('/rides').success(function(data) {
            $scope.rides = data;
            $scope.page += 1;
        });
    };

    $scope.page = 1;
    $scope.getNextPage = function() {
        $http.get('/rides/' + $scope.page).success(function(data) {
            if (0 == data.length) {
                $scope.page = -1;
                return;
            }
            $scope.rides = $scope.rides.concat(data);
            $scope.page +=1;
        });
    };

    $scope.isPublicToString = function(ride) {
        if (ride.private) {
            return "private";
        }
        return "public";
    };

    $scope.isOnATainerString = function(ride) {
        if (ride.trainer) {
            return "on a trainer";
        }
        return "outside";
    };

    $scope.isRideInError = function(ride) {
        if(ride.trainer && !ride.private) {
            return "publictrainer";
        }
        if(!ride.trainer && ride.private) {
            return "privateoutdoor";
        }
        return "ride"
    };

    $scope.showAll = true;
    $scope.shouldHide = function(ride) {
        //If the ride is on a trainer and public it's an error
        if ( !$scope.showAll && "ride" == $scope.isRideInError(ride)) {
            return true;
        }
        return false;
    }

    $scope.loadUser();
    $scope.privateRides();

});

