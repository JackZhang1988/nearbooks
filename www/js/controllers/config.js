angular.module('starter.controllers')
    .controller('ConfigCtrl', function($scope,$ionicHistory, UserService) {
        $scope.logout = function() {
            UserService.logout();
        }
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
    })
