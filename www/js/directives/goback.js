angular.module('starter.directive')
    .directive('goback', function($compile) {
        return {
            restrict: 'E',
            template: '<button ng-click="goBack()" class="button back-button buttons button-clear header-item"> < i class = "icon ion-ios-arrow-back" > < /i> < /button>',
            controller:function($scope,$ionicHistory){
                $scope.goback = $ionicHistory.go(-1);
            }
        }
    })
