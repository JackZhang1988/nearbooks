angular.module('starter.directive')
    .directive('imgmap', function($compile, $ionicModal, Map) {
        var getTpl = function(lnglat) {
            if (!lnglat || lnglat.length != 2) {
                return '';
            }
            var imgSrc = 'http://restapi.amap.com/v3/staticmap?zoom=10&size=200*100&markers=mid,0x008000,A:' + lnglat[0] + ',' + lnglat[1] + '&key=ee95e52bf08006f63fd29bcfbcf21df0'

            return '<img src="' + imgSrc + '" class="imgmap" ng-click="showMapModal()">';
        }
        return {
            restrict: 'EA',
            scope: {
                lnglat: '='
            },
            controller: function($scope) {
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
                            longitude: $scope.lnglat[0],
                            latitude: $scope.lnglat[1]
                        });
                        Map.initGeolocation(mapObj);
                    })
                }
                $scope.closeMapModal = function() {
                    $scope.mapModal.hide();
                }
            },
            link: function($scope, element, attrs) {
                $scope.$watch('lnglat', function(newValue, oldValue) {
                    if (newValue == oldValue) {
                        return;
                    }
                    element.html(getTpl($scope.lnglat));
                    $compile(element.contents())($scope);
                })
            }
        }
    })
