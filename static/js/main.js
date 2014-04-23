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
            //Either ran out of pages or we didn't get back a full page.
            if (0 == data.length) {
                $scope.page = -1;
                return;
            }
            //TODO 50 is the page length on the server side, should sent it in & decouple.
            $scope.rides = $scope.rides.concat(data);
            if ( 50 != data.length ) {
                $scope.page = -1;
            } else {
                $scope.page += 1;
            }
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

    $scope.isPublicTrainer = function(ride) {
        return ride.trainer && !ride.private;
    };

    $scope.isPrivateOutside = function(ride) {
        return !ride.trainer && ride.private;
    };

    $scope.isRideInError = function(ride) {
        if($scope.isPublicTrainer(ride)) {
            return "publictrainer";
        }
        if($scope.isPrivateOutside(ride)) {
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
    };

    $scope.fix = function(ride) {
        alert("Fixing " + ride.name);
    };

    $scope.loadUser();
    $scope.privateRides();

});

