angular.module('starter.controllers')
    .controller('BookDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicSlideBoxDelegate, $ionicModal, Api, Map, UserService) {
        $scope.book = {};
        $scope.curUser = UserService.getUser();
        $scope.goBack = function() {
            // $ionicHistory.goBack(-1);
            window.history.go(-1);
        }
        if (!$stateParams.id) {
            $state.go('/');
        } else {
            Api.getBookById($stateParams.id).then(function(res) {
                if (res.status == 0) {
                    $scope.book = res.data;
                    $scope.book.locationImg = 'http://restapi.amap.com/v3/staticmap?zoom=10&size=200*100&markers=mid,0x008000,A:' + res.data.lnglat[0] + ',' + res.data.lnglat[1] + '&key=ee95e52bf08006f63fd29bcfbcf21df0'
                    $scope.user = res.data._user;
                    if ($scope.book.status == 'BORROWED') {
                        $scope.bookActionStr = '借用中';
                    } else {
                        $scope.bookActionStr = '我想借';
                    }
                    $ionicSlideBoxDelegate.update();
                } else {
                    $ionicPopup.alert({
                        title: '获取图书失败!',
                        template: res.err
                    }).then(function() {
                        $state.go('tab.booklist');
                    });
                }
            })
        }
        $ionicModal.fromTemplateUrl('modal-slider.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.slideModal = modal;
        })
        $scope.showSlideModal = function(index) {
            console.log('show modal');
            $scope.slideModal.show();
        }

        $scope.closeSlideModal = function() {
            $scope.slideModal.hide();
        };

        $ionicModal.fromTemplateUrl('modal-map.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.mapModal = modal;
        })
        $scope.showMapModal = function(pos) {
            var mapObj;
            $scope.mapModal.show().then(function() {
                mapObj = Map.mapInit({
                    longitude: $scope.book.lnglat[0],
                    latitude: $scope.book.lnglat[1]
                });
                Map.initGeolocation(mapObj);
            })
        }
        $scope.closeMapModal = function() {
            $scope.mapModal.hide();
        }

        // document.addEventListener("deviceready", function() {
        //     var scheme;
        //     $cordovaAppAvailability.check('twitter://')
        //         .then(function() {
        //             // is available
        //         }, function() {
        //             // not available
        //         });
        // }, false);

        $scope.borrow = function() {
            Api.borrowBook({
                ownerId: $scope.user._id,
                bookId: $scope.book._id,
                borrowerId: $scope.curUser._id
            }).then(function(res) {
                if (res.status == 0) {
                    $ionicPopup.alert({
                        title: '申请成功'
                    }).then(function() {
                        $state.go('tab.booklist');
                    });
                }
            })
        }
    })
