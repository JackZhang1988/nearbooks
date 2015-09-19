angular.module('starter.controllers')
    .controller('ConfigCtrl', function($scope,$ionicHistory, $state, UserService) {
        if(!UserService.isLogin()){
        	UserService.doLogin();
        }
        $scope.logout = function() {
            UserService.logout();
        }
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
    })
