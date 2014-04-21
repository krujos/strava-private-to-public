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
        $http.get('/privaterides').success(function(data) {
            $scope.rides = data;
        });
    };

    $scope.isPublicToString = function(ride) {
        if (ride.private) {
            return "private";
        }
        return "public";
    };

    $scope.loadUser();
    $scope.privateRides();

});

