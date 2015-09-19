angular.module('starter.controllers')
    .controller('LoginCtrl', function($scope,$ionicHistory, $ionicPopup, $state, $window, $timeout,UserService) {
        $scope.data = {};
        if (UserService.isLogin()) {
            // 登陆后跳转禁止后退按钮
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('tab.account');
        }
        $scope.login = function() {
            UserService.loginUser({
                name: $scope.data.username,
                password: $scope.data.password
            }).then(function(res) {
                if (res.status == 0) {
                    $window.localStorage.token = res.token;
                    $window.localStorage.user = JSON.stringify(res.user);
                    $window.location.reload(true); //re-bootstrap everything
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: '登陆失败!',
                        template: '请检查你的用户名和密码!'
                    });
                }
            });
        }

    })
