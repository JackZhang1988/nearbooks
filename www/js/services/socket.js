angular.module('starter.services')
    .factory('SocketService', function($rootScope, UserService) {
        var user = UserService.getUser();
        var socket = io.connect('<%=serverhost%>');
        if (user._id) {
            socket.emit('join', {
                userId: user._id
            });
        }
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    })
