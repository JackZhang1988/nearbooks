angular.module('starter.services')
    .service('UserService', function($http, ApiEndpoint, $window, $state, jwtHelper) {
        return {
            loginUser: function(data) {
                return $http({
                    method: 'POST',
                    data: data,
                    url: ApiEndpoint + '/user/login'
                }).then(function(res) {
                    return res.data;
                })
            },
            signinUser: function(data) {
                return $http({
                    method: 'POST',
                    data: data,
                    url: ApiEndpoint + '/user/signin'
                }).then(function(res) {
                    return res.data;
                })
            },
            isSigned: function(name) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/user/isSigned',
                    params: {
                        name: name
                    }
                }).then(function(res) {
                    return res.data;
                })
            },
            addUserAvatar: function(imgData) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/user/userAvatar',
                    data: imgData,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                });
            },
            updateUserInfo: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/user/userinfo',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            },
            getUserInfo: function(userId) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/user',
                    params: {
                        userId: userId
                    }
                }).then(function(res) {
                    return res.data;
                })
            },
            isLogin: function() {
                var token = $window.localStorage.token;
                return token ? (jwtHelper.isTokenExpired(token) ? false : true) : false;
            },
            logout: function() {
                $window.localStorage.removeItem('token');
                $window.localStorage.removeItem('user');
                $state.go('login');
            },
            doLogin: function() {
                $state.go('login');
            },
            getUser: function() {
                return JSON.parse($window.localStorage.user);
            },
            addSchedule: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/user/addSchedule',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            },
            getSchedule:function(scheduleId){
                return $http({
                    method:'GET',
                    url:ApiEndpoint+'/user/schedule',
                    params:{
                        scheduleId:scheduleId
                    }
                }).then(function(res){
                    return res.data;
                })
            }
        }
    })
