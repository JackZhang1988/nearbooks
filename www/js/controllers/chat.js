angular.module('starter.controllers')
    .controller('ChatCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicScrollDelegate, $timeout, Api, UserService, SocketService) {
        if ($stateParams.sender) {
            $scope.user = UserService.getUser();
            if ($stateParams.sender == $scope.user._id) {
                $ionicPopup.alert({
                    title: '不能和自己聊天'
                }).then(function() {
                    $state.go('tab.messages');
                });
                return;
            }

            $scope.toUser = {
                _id: $stateParams.sender,
                name: $stateParams.name
            }
            var chatUsers = [$stateParams.sender, $scope.user._id].sort();

            var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
            var txtInput;
            $scope.messages = [];

            $scope.input = {
                message: localStorage['userMessage-' + $stateParams.sender] || ''
            };

            function keepKeyboardOpen() {
                console.log('keepKeyboardOpen');
                txtInput.one('blur', function() {
                    console.log('textarea blur, focus back on it');
                    txtInput[0].focus();
                });
            }

            SocketService.on('msg:chat', function(res) {
                $scope.messages.push({
                    sender: res.sender,
                    content: res.content
                })
                $timeout(function() {
                    viewScroll.scrollBottom();
                }, 0);
            })

            SocketService.on('msg:borrow', function(msg) {
                // $scope.msgList[msg.id] = handleMsg(msg);
                $scope.messages.push(msg);
            });

            $scope.sendMessage = function() {
                keepKeyboardOpen();
                $scope.messages.push({
                    sender: $scope.user._id,
                    content: {
                        contentType: 'text',
                        info: $scope.input.message
                    }
                });

                Api.sendChatMsg({
                    chatUsers: chatUsers,
                    sender: $scope.user._id,
                    receiver: $scope.toUser._id,
                    content: {
                        contentType: 'text',
                        info: $scope.input.message
                    }
                }).then(function(res) {
                    if (res.status == 0) {
                        console.log('消息发送成功', res.chat.content.info);
                    }
                })
                $scope.input.message = '';
                $timeout(function() {
                    viewScroll.scrollBottom();
                }, 0);
            }

            $scope.$watch('input.message', function(newValue, oldValue) {
                console.log('input.message $watch, newValue ' + newValue);
                if (!newValue) newValue = '';
                localStorage['userMessage-' + $stateParams.sender] = newValue;
            });

            $scope.$on('$ionicView.enter', function() {
                Api.getChatMsgs({
                    chatUsers: chatUsers
                }).then(function(res) {
                    if (res.status == 0) {
                        $scope.messages = res.chatList;
                        $timeout(function() {
                            viewScroll.scrollBottom();
                        }, 0);
                    } else {
                        $ionicPopup.alert({
                            title: '获取聊天信息失败'
                        }).then(function() {
                            $state.go('tab.booklist');
                        });
                    }
                })
                $timeout(function() {
                    footerBar = document.body.querySelector('#userMessagesView .bar-footer');
                    scroller = document.body.querySelector('#userMessagesView .scroll-content');
                    txtInput = angular.element(footerBar.querySelector('textarea'));
                }, 0);
            });



            $scope.$on('$ionicView.beforeLeave', function() {
                if (!$scope.input.message || $scope.input.message === '') {
                    localStorage.removeItem('userMessage-' + $stateParams.sender);
                }
            });
        }
    })
