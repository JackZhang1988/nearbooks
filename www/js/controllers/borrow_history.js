angular.module('starter.controllers')
    .controller('BorrowHistoryCtrl', function($scope, $stateParams, $ionicPopup, Api, UserService) {
        $scope.bHis = {};
        $scope.curUser = UserService.getUser();
        $scope.actionShow = true;
        if (!$stateParams.id) {
            $state.go('/');
        } else {
            Api.getBorrowHistory($stateParams.id).then(function(res) {
                if (res.statue == 0) {
                    $scope.bHis = res.bHis
                    switch ($scope.bHis.status) {
                        case 'ASK_BORROW':
                            $scope.bHis.statusStr = '申请借用';
                            break;
                        case 'REFUSE_BORROW':
                            if ($scope.curUser._id == $scope.bHis.owner) {
                                $scope.bHis.statusStr = '你取消了申请';
                            } else {
                                $scope.bHis.statusStr = '对方取消了申请';
                            }
                            $scope.actionShow = false;
                            break;
                        case 'BORROWED':
                            if ($scope.curUser._id == $scope.bHis.owner) {
                                $scope.bHis.statusStr = '你同意了申请';
                            } else {
                                $scope.bHis.statusStr = '对方同意了申请';
                            }
                            break;
                        default:
                            $scope.bHis.statusStr = '';
                            $scope.actionShow = false;
                            break;
                    }
                }
            })

            var confirmHandler = function(res, status) {
                if (res) {
                    Api.updateBorrowStatus({
                        borrowId: $scope.bHis._id,
                        status: status
                    }).then(function(res) {
                        if (res.status == 0) {
                            window.location.reload();
                        }
                    })
                }
            }
            $scope.refuseApply = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '你确定想要拒绝此次申请？',
                    cancelText: '点错了',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    confirmHandler(res, 'REFUSE_BORROW');
                });

            }
            $scope.agressApply = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '你确定同意此次申请？',
                    cancelText: '点错了',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    confirmHandler(res, 'BORROWED');
                });
            }
            $scope.cancelApply = function() {
                var confirmPopup = $ionicPopup.confirm({
                    title: '你确定同意此次申请？',
                    cancelText: '点错了',
                    okText: '确定'
                });
                confirmPopup.then(function(res) {
                    confirmHandler(res, 'CANCEL_BORROW');
                });
            }
        }
    })
