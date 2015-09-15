angular.module('starter.controllers')
    .controller('SigninCtrl', function($scope, UserService, $ionicPopup, $state, $window) {
        $scope.data = {};
        $scope.err = '';
        $scope.$watch('data', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            if (!$scope.data.name) {
                $scope.err = '用户名不能为空';
            } else if (!$scope.data.password) {
                $scope.err = '密码不能为空';
            } else if ($scope.data.password != $scope.data.password2) {
                console.log('password2 not same');
                $scope.err = '密码不一致';
            } else {
                $scope.err = '';
            }
        }, true)
        $scope.signin = function() {
            if (!$scope.err) {
                UserService.signinUser({
                    name: $scope.data.name,
                    phone: $scope.data.phone,
                    password: $scope.data.password
                }).then(function(res) {
                    if (res.status == 0) {
                        $window.localStorage.token = res.token;
                        $window.localStorage.user = JSON.stringify(res.user);
                        $state.go('userinfo', {
                            action: 'sigin'
                        });
                        // var alertPopup = $ionicPopup.alert({
                        //     title: '注册成功!'
                        // });
                        // alertPopup.then(function(){
                        // })
                    } else {
                        $ionicPopup.alert({
                            title: '注册失败!',
                            template: res.err
                        });
                    }
                })
            };
        }
    })
