angular.module('starter.controllers', [])
    .controller('UserInfoCtrl', function($scope, $state, $stateParams, UserService, ApiEndpoint) {
        $scope.userInfo = {};
        $scope.curUser = UserService.getUser();
        $scope.signature = '';
        $scope.addUserImgAction = ApiEndpoint + '/user/userAvatar';
        if ($stateParams.action == 'update') {
            UserService.getUserInfo($scope.curUser._id).then(function(res) {
                $scope.userInfo = res.user;
                $scope.avatarUrl = res.user.avatar;
            })
        }
        $scope.fileChange = function(element) {
            var imgFile = element.files[0];
            $scope.loading = true;
            var fd = new FormData();
            fd.append('file', element.files[0]);
            UserService.addUserAvatar(fd).success(function(res) {
                console.log(res);
                if (res.status == 0) {
                    $scope.loading = false;
                    $scope.avatarUrl = res.data.url;
                }
            }).error(function(err) {
                $scope.loading = false;
            })
        }
        $scope.updateUserInfo = function() {
            UserService.updateUserInfo({
                userId: $scope.curUser._id,
                sex: $scope.userInfo.sex,
                signature: $scope.userInfo.signature,
                avatarUrl: $scope.avatarUrl
            }).then(function(res) {
                if (res.status == 0) {
                    $state.go('tab.booklist');
                }
            })
        }
    })
