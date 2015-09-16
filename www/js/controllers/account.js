angular.module('starter.controllers')
    .controller('AccountCtrl', function($scope, $state, $stateParams, UserService, Api) {
        if(!UserService.isLogin()){
            $state.go('login');
            return;
        }
        $scope.userInfo = {};
        $scope.isConfig = true;
        var userId;
        $scope.goBack = function() {
            window.history.go(-1);
        }
        if($stateParams.id){
            userId = $stateParams.id;
            $scope.isConfig = false;
        }else{
            $scope.curUser = UserService.getUser();
            userId = $scope.curUser._id;
        }
        if (userId) {
            UserService.getUserInfo(userId).then(function(res) {
                if (res.status == 0) {
                    console.log(res.user);
                    $scope.userInfo = res.user;
                }
            })
            Api.getUserBooks(userId).then(function(res) {
                if (res.status == 0) {
                    console.log(res.books);
                    $scope.userBooks = res.books;
                }
            })
        } else {
            $state.go('login');
        }
    })
