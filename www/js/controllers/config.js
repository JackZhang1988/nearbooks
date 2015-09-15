angular.module('starter.controllers', [])
    .controller('ConfigCtrl', function($scope, UserService) {
        $scope.logout = function() {
            UserService.logout();
        }
    })
