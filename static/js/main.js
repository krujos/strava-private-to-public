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
        $http.get('/athleteinfo').success(function (data) {
            $scope.athlete_info = data;
            $scope.user = data.firstname + " " + data.lastname;
        });
    };

    $scope.loadUser();

});

