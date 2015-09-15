angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $state, $stateParams, UserService) {
        $scope.goBack = function() {
            window.history.go(-1);
        }
        if($stateParams.id){
            UserService.getSchedule($stateParams.id).then(function(res){
                if(res.status == 0){
                    $scope.schedule = res.schedule;
                }else{
                    
                }
            })
        }else{
           $state.go('tab.collections');
        }
    })
