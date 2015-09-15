angular.module('starter.controllers', [])
    .controller('MessagesCtrl', function($scope, SocketService, Api, UserService) {
        $scope.msgList = []; // todo: 合并相同用户的msg
        var user = UserService.getUser();
        if (user) {
            // test socket
            // SocketService.on('init',function(msg){
            //    $scope.msgList[msg.id] = handleMsg(msg);
            // })
            SocketService.on('msg:borrow', function(msg) {
                // $scope.msgList[msg.id] = handleMsg(msg);
                $scope.msgList.push(msg);
            });
            Api.getToUserMsgs(user._id).then(function(res) {
                if (res.status == 0) {
                    $scope.msgList = $scope.msgList.concat(res.chatList);
                    console.log($scope.msgList);
                }
            })
        }
    })
