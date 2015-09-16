angular.module('starter.controllers')
    .controller('ScheduleCtrl', function($scope, $state, $stateParams, UserService, Api) {
        $scope.goBack = function() {
            window.history.go(-1);
        }
        if($stateParams.id && $stateParams.userId){
            UserService.getSchedule($stateParams.id).then(function(res){
                if(res.status == 0){
                    $scope.schedule = res.schedule;
                }else{
                    
                }
            })
            Api.getUserBooks($stateParams.userId).then(function(res) {
                if (res.status == 0) {
                    console.log(res.books);
                    $scope.userBooks = res.books;
                }
            })
        }else{
           $state.go('tab.collections');
        }
    })
