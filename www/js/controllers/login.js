angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, UserService, $ionicPopup, $state, $window) {
    $scope.data = {};

    $scope.login = function() {
        UserService.loginUser({
            name: $scope.data.username,
            password: $scope.data.password
        }).then(function(res) {
            if (res.status == 0) {
                $window.localStorage.token = res.token;
                $window.localStorage.user = JSON.stringify(res.user);
                $window.location.reload(true); //re-bootstrap everything
                $state.go('tab.account');
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: '登陆失败!',
                    template: '请检查你的用户名和密码!'
                });
            }
        });
    }

})
