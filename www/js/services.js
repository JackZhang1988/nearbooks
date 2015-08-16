angular.module('starter.services', ['angular-jwt'])
    .factory('Map', function() {
        var mapObj;
        var mapInit = function(pos) {
            mapObj = new AMap.Map('mapContainer', {
                rotateEnable: true,
                dragEnable: true,
                zoomEnable: true,
                zooms: [3, 18],
                zoom: 15,
                //二维地图显示视口
                view: new AMap.View2D({
                    zoom: 13, //地图显示的缩放级别,
                    center: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null
                })
            });
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
            return mapObj;
        }
        var initAutoSearch = function(keywords, autoOptions, success, fail) {
            var auto;
            AMap.service(["AMap.Autocomplete"], function() {
                auto = new AMap.Autocomplete(autoOptions);
                if (keywords.length > 0) {
                    auto.search(keywords, function(status, result) {
                        success(result);
                    })
                } else {
                    fail && fail();
                }
            })
        }
        var citySearch = function(success, fail) {
            AMap.service(["AMap.CitySearch"], function() {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        if (result && result.city && result.bounds) {
                            success(result);
                        }
                    } else {
                        fail && fail();
                    }
                });
            });
        }
        var setMaker = function(mapObj, pos) {
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
        }
        var setCenter = function(mapObj, pos) {
            setMaker(mapObj, pos);
            var lg = new AMap.LngLat(pos.longitude, pos.latitude);
            mapObj.setCenter(lg);
        }
        return {
            mapInit: mapInit,
            initAutoSearch: initAutoSearch,
            citySearch: citySearch,
            setMaker: setMaker,
            setCenter: setCenter
        }
    })
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
            }
        }
    })
    .factory('jsonpInterceptor', function($timeout, $window) {
        return {
            'request': function(config) {
                if (config.method === 'JSONP') {
                    var callbackId = angular.callbacks.counter.toString(36);
                    config.callbackName = 'angular_callbacks_' + callbackId;
                    config.url = config.url.replace('JSON_CALLBACK', config.callbackName);

                    $timeout(function() {
                        $window[config.callbackName] = angular.callbacks['_' + callbackId];
                    }, 0, false);
                }

                return config;
            },

            'response': function(response) {
                var config = response.config;
                if (config.method === 'JSONP') {
                    delete $window[config.callbackName]; // cleanup
                }

                return response;
            },

            'responseError': function(rejection) {
                var config = rejection.config;
                if (config.method === 'JSONP') {
                    delete $window[config.callbackName]; // cleanup
                }

                return $q.reject(rejection);
            }
        };
    })
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
            isLogin: function() {
                var token = $window.localStorage.token;
                return token ? (jwtHelper.isTokenExpired(token) ? false : true) : false;
            },
            loginOut: function() {
                $window.localStorage.token = null;
                $window.localStorage.user = null;
            },
            doLogin: function() {
                $state.go('login');
            },
            getUser:function(){
                return JSON.parse($window.localStorage.user);
            }
        }
    })
