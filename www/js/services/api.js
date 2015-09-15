angular.module('starter.services')
    .factory('Api', function($http, ApiEndpoint) {
        return {
            addNewBook: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/book',
                    data: data
                });
            },
            addBookImg: function(imgData) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/book/bookImg',
                    data: imgData,
                    headers: {
                        'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                });
            },
            addLocation: function(location) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/user/location',
                    data: location
                }).then(function(res) {
                    return res.data;
                })
            },
            getAllBooks: function(data) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/book/list',
                    params: data
                }).then(function(res) {
                    return res.data;
                })
            },
            getUserBooks: function(userId) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/book/user',
                    params: {
                        userId: userId
                    }
                }).then(function(res) {
                    return res.data;
                })
            },
            getBookById: function(id) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/book/item',
                    params: {
                        id: id
                    }
                }).then(function(res) {
                    return res.data;
                })
            },
            getDoubanInfo: function(keywords) {
                return $http({
                    method: 'JSONP',
                    url: 'https://api.douban.com/v2/book/search?q=' + keywords + '&count=5&&callback=JSON_CALLBACK'
                }).then(function(res) {
                    return res.data;
                })
            },
            borrowBook: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/book/borrowBook',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            },
            getChatMsgs: function(data) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/chat/msgBetweenUsers',
                    params: data
                }).then(function(res) {
                    return res.data;
                })
            },
            sendChatMsg: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/chat/msgBetweenUsers',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            },
            getToUserMsgs: function(userId) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/chat/msgToUser',
                    params: {
                        userId: userId
                    }
                }).then(function(res) {
                    return res.data
                })
            },
            getBorrowHistory: function(borrowId) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/book/borrowHistory',
                    params: {
                        id: borrowId
                    }
                }).then(function(res) {
                    return res.data
                })
            },
            updateBorrowStatus: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/book/updateBorrowStatus',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            }
        }
    })
