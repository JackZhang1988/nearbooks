angular.module('starter.filter', [])
    .filter('addserverhost', function(ImgUrl) {
        return function(url) {
            return ImgUrl + url;
        };
    })