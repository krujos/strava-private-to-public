'use strict';

var stravaApp = angular.module('stravaApp', []);

// Main app controller.
stravaApp.controller('StravaController', function StravaController($scope, $http) {

    $scope.login = function() {
        $http.get('/login').success(function(data) {
            window.location.replace(data);
        });


    }
});

