angular.module('starter.services', ['angular-jwt'])
    .factory('Map', function() {
        var mapObj = {};
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
            try {
                setMaker(mapObj, pos);
                var lg = new AMap.LngLat(pos.longitude, pos.latitude);
                mapObj.setCenter(lg);
            } catch (e) {

            }
        }
        var initGeolocation = function(mapObj, onComplete, onError) {
            mapObj.plugin('AMap.Geolocation', function() {
                geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true, //是否使用高精度定位，默认:true
                    timeout: 10000, //超过10秒后停止定位，默认：无穷大
                    maximumAge: 0, //定位结果缓存0毫秒，默认：0
                    convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                    showButton: true, //显示定位按钮，默认：true
                    buttonPosition: 'RB', //定位按钮停靠位置，默认：'LB'，左下角
                    buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                    showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
                    showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
                    panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
                    zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                });
                mapObj.addControl(geolocation);
                AMap.event.addListener(geolocation, 'complete', onComplete); //返回定位信息
                AMap.event.addListener(geolocation, 'error', onError); //返回定位出错信息
            });
        }
        var geocoder;
        var getLngLatInfo = function(pos, geocoder_callBack) {
            var lnglatXY = new AMap.LngLat(pos.longitude, pos.latitude);
            //加载地理编码插件 
            mapObj.plugin(["AMap.Geocoder"], function() {
                geocoder = new AMap.Geocoder({
                    radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息 
                    extensions: "all" //返回地址描述以及附近兴趣点和道路信息，默认"base" 
                });
                //返回地理编码结果 
                AMap.event.addListener(geocoder, "complete", geocoder_callBack);
                //逆地理编码 
                geocoder.getAddress(lnglatXY);
            });

        }
        return {
            mapInit: mapInit,
            initAutoSearch: initAutoSearch,
            citySearch: citySearch,
            setMaker: setMaker,
            setCenter: setCenter,
            initGeolocation: initGeolocation,
            getLngLatInfo: getLngLatInfo
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
            getUserBooks: function(userId) {
                return $http({
                    method: 'GET',
                    url: ApiEndpoint + '/book/user',
                    params: {
                        userId:userId
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
            getChatMsgs:function(data){
                return $http({
                    method:'GET',
                    url: ApiEndpoint + '/chat/msgBetweenUsers',
                    params:data
                }).then(function(res){
                    return res.data;
                })
            },
            sendChatMsg:function(data){
                return $http({
                    method:'POST',
                    url: ApiEndpoint + '/chat/msgBetweenUsers',
                    data:data
                }).then(function(res){
                    return res.data;
                })
            },
            getToUserMsgs:function(userId){
                return $http({
                    method:'GET',
                    url: ApiEndpoint + '/chat/msgToUser',
                    params:{
                        userId:userId
                    }
                }).then(function(res){
                    return res.data
                })
            },
            getBorrowHistory:function(borrowId){
                return $http({
                    method:'GET',
                    url: ApiEndpoint +'/book/borrowHistory',
                    params:{
                        id:borrowId
                    }
                }).then(function(res){
                    return res.data
                })
            },
            updateBorrowStatus:function(data){
                return $http({
                    method:'POST',
                    url:ApiEndpoint+'/book/updateBorrowStatus',
                    data:data
                }).then(function(res){
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
            isSigned:function(name){
                return $http({
                    method:'GET',
                    url:ApiEndpoint+'/user/isSigned',
                    params:{
                        name:name
                    }
                }).then(function(res){
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
            updateUserInfo:function(data){
                return $http({
                    method:'POST',
                    url: ApiEndpoint+'/user/userinfo',
                    data:data
                }).then(function(res){
                    return res.data;
                })
            },
            getUserInfo:function(userId){
                return $http({
                    method:'GET',
                    url:ApiEndpoint+'/user',
                    params:{
                        userId:userId
                    }
                }).then(function(res){
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
            getUser: function() {
                return JSON.parse($window.localStorage.user);
            }
        }
    })
    .factory('SocketService', function($rootScope,UserService) {
        var user = UserService.getUser();
        var socket = io.connect('<%=serverhost%>');
        if(user._id){
            socket.emit('join',{userId:user._id});
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
