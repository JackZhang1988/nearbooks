angular.module('starter.controllers')
    .controller('ConfigCtrl', function($scope, UserService) {
        $scope.logout = function() {
            UserService.logout();
        }
        $scope.goBack = function() {
            window.history.go(-1);
        }
    })
