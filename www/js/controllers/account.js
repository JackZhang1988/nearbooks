angular.module('starter.controllers')
    .controller('AccountCtrl', function($scope, $state, UserService, Api) {
        $scope.userInfo = {};
        $scope.curUser = UserService.getUser();
        if ($scope.curUser && $scope.curUser._id) {
            UserService.getUserInfo($scope.curUser._id).then(function(res) {
                if (res.status == 0) {
                    console.log(res.user);
                    $scope.userInfo = res.user;
                }
            })
            Api.getUserBooks($scope.curUser._id).then(function(res) {
                if (res.status == 0) {
                    console.log(res.books);
                    $scope.userBooks = res.books;
                }
            })
        } else {
            $state.go('login');
        }
    })
