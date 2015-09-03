// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'templates','addserverFilter'])

.constant('ApiEndpoint', 'http://172.16.28.80:3000/api')
.constant('ImgUrl','http://172.16.28.80:3000')

.run(['$ionicPlatform', function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
        //启动极光推送服务 
        document.addEventListener('deviceready', function(data) {
            window.plugins.jPushPlugin.init();
            //调试模式 

            window.plugins.jPushPlugin.setDebugMode(true);

        }, false);
    });
}])

.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$sceDelegateProvider', 'jwtInterceptorProvider', function($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, jwtInterceptorProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://172.16.28.80:3000/**'
    ]);

    // The blacklist overrides the whitelist so the open redirect here is blocked.
    // $sceDelegateProvider.resourceUrlBlacklist([
    //     'http://myapp.example.com/clickThru**'
    // ]);

    jwtInterceptorProvider.tokenGetter = function() {
        return localStorage.getItem('token');
    }
    $httpProvider.interceptors.push('jwtInterceptor');
    // support douban jsonp
    $httpProvider.interceptors.push('jsonpInterceptor');

    // $ionicConfigProvider.views.transition('platform');

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('signin', {
            url: '/signin',
            controller: 'SigninCtrl',
            templateUrl: 'signin.html'
        })
        .state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'login.html'
        })

    .state('bookdetail', {
            url: '/book/:id',
            templateUrl: 'book-detail.html',
            controller: 'BookDetailCtrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "tabs.html"
        })

    // Each tab has its own nav history stack:

    .state('tab.booklist', {
            url: '/booklist',
            views: {
                'tab-booklist': {
                    templateUrl: 'tab-booklist.html',
                    controller: 'BookListCtrl'
                }
            }
        })
        .state('tab.messages', {
            url: '/messages',
            views: {
                'tab-messages': {
                    templateUrl: 'tab-messages.html',
                    controller: 'MessagesCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'tab-account.html',
                controller: 'AccountCtrl'
            }
        },
        data: {
            requireLogin: true
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/booklist');

}]);

angular.module('starter.controllers', [])
.controller('BookListCtrl',['$scope', '$state', '$ionicModal', '$ionicPopup', '$timeout', '$ionicLoading', '$cordovaGeolocation', '$ionicPlatform', '$timeout', 'ApiEndpoint', 'ImgUrl', 'Api', 'Map', 'UserService', function($scope,$state,$ionicModal,$ionicPopup,$timeout,$ionicLoading,$cordovaGeolocation,$ionicPlatform, $timeout, ApiEndpoint, ImgUrl, Api, Map,UserService){

  var lnglat = {};
  $ionicPlatform.ready(function() {
      var posOptions = {
          timeout: 5000,
          enableHighAccuracy: false
      };
      $cordovaGeolocation
          .getCurrentPosition(posOptions)
          .then(function(position) {
              lnglat = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
              }
              Api.getAllBooks(lnglat).then(function(res){
                $ionicLoading.hide();
                if(res.status == 0){
                  $scope.booklist = res.data;
                }
              })
          }, function(err) {
              // error
              Api.getAllBooks().then(function(res){
                $ionicLoading.hide();
                if(res.status == 0){
                  $scope.booklist = res.data;
                }
              })
          });


  });
  // $scope.booklist = Booklist.all(); // mock data
  $scope.booklist =[];
  $ionicLoading.show();
    
  // 添加图片列表
  $scope.prevImgList = [];
  // 添加的图书信息
  $scope.bookInfo = {};

  $scope.location = {};

  // 添加图片的接口地址
  $scope.addNewBookAction = ApiEndpoint+'/bookImg';
  // 用户保存过得位置信息，从localStorage 读取
  $scope.usrLocations = JSON.parse(window.localStorage.getItem('commonLocation'))||[];
  // 用户当前选择的地理信息
  $scope.selectedLocation = $scope.usrLocations[0];
  if($scope.usrLocations.length){
   $scope.location.name = $scope.usrLocations[0].name; 
  }

  $ionicModal.fromTemplateUrl('/templates/book-add.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.addBookModal = modal;
  });

  $scope.getDoubanInfo = function(){
    Api.getDoubanInfo($scope.bookInfo.bookName).then(function(res){
      $scope.doubanSuggestShow = true;
      $scope.doubanSuggestBooks = res.books;
    })
  }

  $scope.doubanBookSelected =function(index){
    $scope.doubanSuggestShow = false;
    var doubanBook = $scope.doubanSuggestBooks[index];
    $scope.bookInfo.bookName = doubanBook.title;
    $scope.bookInfo.writer = doubanBook.author[0];
    $scope.bookInfo.price = doubanBook.price;
    $scope.bookInfo.doubanUrl = doubanBook.alt;
    $scope.bookInfo.summary = doubanBook.summary;
    $scope.bookInfo.doubanRating = doubanBook.rating.average;
  }

  $scope.fileChange = function(element){
    var imgFile = element.files[0];
    $scope.bookInfo.loading = true;
    var fd = new FormData();
    fd.append('file',element.files[0]);
    Api.addBookImg(fd).success(function(res){
      console.log(res);
      if(res.status == 0){
        $scope.bookInfo.loading=false;
        // $scope.bookImgList = res.data.url;
        $scope.prevImgList.push(res.data.url)
      }
    }).error(function(err){
      $scope.bookInfo.loading= false;
    })
  }
  $scope.openAddBookModal = function(){
    if(UserService.isLogin()){
      $scope.prevImgList = [];
      $scope.bookInfo={};
      $scope.addBookModal.show();
      $scope.user = UserService.getUser();
    }else{
      UserService.doLogin();
    }
  }
  $scope.closeAddBookModal = function(){
    $scope.addBookModal.hide();
  }

  function validate(){
    if($scope.prevImgList.length <= 0){
      return '至少上传一张图片!';
    }
    if(!$scope.bookInfo.bookName){
      return '请填写图书名!';
    }
    if(!$scope.selectedLocation){
      return '请填写图书位置信息';
    }
    return 1;
  }
  $scope.submitNew = function(){
    console.log('submitNew');
    var validateResut = validate();
    if(validateResut === 1){
      $ionicLoading.show();

      Api.addNewBook({
        bookImgs:$scope.prevImgList,
        bookName:$scope.bookInfo.bookName,
        bookDesc:$scope.bookInfo.bookDesc,
        doubanInfo: {
            writer: $scope.bookInfo.writer,
            price: $scope.bookInfo.price,
            url: $scope.bookInfo.doubanUrl,
            summary: $scope.bookInfo.summary,
            rating: $scope.bookInfo.doubanRating
        },
        lnglat:$scope.selectedLocation.lnglat,
        _user:$scope.user._id
      }).success(function(res){
        $ionicLoading.hide();
        if(res.status == 0){
          var submitAlert = $ionicPopup.alert({
            title:'提交成功',
            okText:'确定'
          });
          submitAlert.then(function(){
            $scope.addBookModal.hide();
          })
          $timeout(function(){
            submitAlert.close();
            $scope.addBookModal.hide();
          },5000)
        }else{
          $ionicPopup.alert({title:res.err});
        }
      })
      
    }else{
      $ionicPopup.alert({title:validateResut});
    }
  }


  $ionicModal.fromTemplateUrl('/templates/location-add.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.addLocationModal = modal;
  });

  var mapObj;
  $scope.openAddLocationModal = function(){
    $scope.selectedLocation={};
    $scope.addLocationModal.show().then(function(){
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
              mapObj = Map.mapInit(pos.coords);
              $scope.selectedLocation.lnglat=[pos.coords.longitude,pos.coords.latitude];
              Map.getLngLatInfo(pos.coords,function(result){
                $scope.selectedLocation.name =result.regeocode.formattedAddress;
                $scope.location.name = result.regeocode.formattedAddress;
              })
              Map.citySearch(function(result){
                $scope.curCity = result.city;
              })
          }, function(error) {
              alert(error.message);
          }, {
              enableHighAccuracy: true,
              timeout: '5000'
          });
      }else{}

    });
  }
  $scope.closeAddLocationModal = function(){
    $scope.addLocationModal.hide();
  }
  $scope.inputChange = function(){
    var ops={
      city:$scope.curCity||''
    }
    Map.initAutoSearch($scope.location.name,ops,function(result){
        $scope.tipResult = result.tips
    },function(){
        $scope.tipResult =[];
    })
  }
  $scope.selectLocation = function(tip){
    $scope.location = tip.location;
    Map.setCenter(mapObj,{
      longitude:$scope.location.lng,
      latitude:$scope.location.lat
    })
    $scope.tipResult = [];
    $scope.selectedLocation = $scope.location;
    $scope.location.name = tip.name;
  }
  $scope.submitLocation = function(){
    $ionicLoading.show();
    Api.addLocation({
      _user:$scope.user._id,
      name:$scope.selectedLocation.name,
      lng:$scope.selectedLocation.lng,
      lat:$scope.selectedLocation.lat
    }).then(function(res){
      $ionicLoading.hide();
      if(res.status == 0){
        $scope.usrLocations.push(res.data);
        window.localStorage.setItem('commonLocation',JSON.stringify($scope.usrLocations));
        $scope.addLocationModal.hide();
        $scope.showLocation=false;
      }
    })
    // $scope.bookInfo.location = $scope.selectedLocation;
  }
  $scope.showLocation=false;
  $scope.triggeLocationShow = function(){
    $scope.showLocation = !$scope.showLocation;
  }
  $scope.selectSuggestLocation = function(index){
    $scope.location = $scope.usrLocations[index];
    $scope.showLocation = false;
  }
}]) 
.controller('LoginCtrl', ['$scope', 'UserService', '$ionicPopup', '$state', '$window', function($scope,UserService,$ionicPopup,$state,$window) {
    $scope.data = {};
 
    $scope.login = function() {
        UserService.loginUser({
            name: $scope.data.username,
            password: $scope.data.password
        }).then(function(data) {
            $window.localStorage.token = data.token;
            $window.localStorage.user = JSON.stringify(data.user);
            $state.go('tab.account');
        },function(data) {
            var alertPopup = $ionicPopup.alert({
                title: '登陆失败!',
                template: '请检查你的用户名和密码!'
            });
        });
    }

}])
.controller('SigninCtrl', ['$scope', 'UserService', '$ionicPopup', '$state', function($scope,UserService,$ionicPopup,$state){
    $scope.data={};
    $scope.err='';
    $scope.$watch('data',function(newValue, oldValue){
      if(newValue == oldValue){
        return;
      }
      if(!$scope.data.name){
        $scope.err = '用户名不能为空';
      }else if(!$scope.data.phone){
        $scope.err = '手机号不能为空';
      }else if(!$scope.data.password){
        $scope.err = '密码不能为空';
      }else if($scope.data.password != $scope.data.password2){
        console.log('password2 not same');
        $scope.err ='密码不一致';
      }else{
        $scope.err = '';
      }
    },true)
    $scope.signin = function(){
      if (!$scope.err) {
        UserService.signinUser({
          name:$scope.data.name,
          phone:$scope.data.phone,
          password:$scope.data.password
        }).then(function(res){
          if(res.status == 0){
            var alertPopup = $ionicPopup.alert({
                title: '注册成功!',
                template: '现在就去登陆吧'
            });
            alertPopup.then(function(){
              $state.go('login',{phone:$scope.data.phone});
            })
          }else{
            $ionicPopup.alert({
                title: '注册失败!',
                template: res.err
            });
          }
        })       
      };
    }
}])
.controller('BookDetailCtrl',['$scope', '$state', '$stateParams', '$ionicPopup', '$ionicSlideBoxDelegate', '$ionicModal', 'Api', 'Map', 'UserService', function($scope,$state,$stateParams,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,Api,Map,UserService){
	$scope.book = {};
  $scope.curUser = UserService.getUser();
  $scope.goBack = function(){
    // $ionicHistory.goBack(-1);
    window.history.go(-1);
  }
  if(!$stateParams.id){
    $state.go('/');
  }else{
    Api.getBookById($stateParams.id).then(function(res){
      if(res.status == 0){
        $scope.book = res.data;
        $scope.book.locationImg = 'http://restapi.amap.com/v3/staticmap?zoom=10&size=200*100&markers=mid,0x008000,A:'+res.data.lnglat[0]+','+ res.data.lnglat[1]+'&key=ee95e52bf08006f63fd29bcfbcf21df0'
        $scope.user = res.data._user;
        $ionicSlideBoxDelegate.update();
      }else{
        $ionicPopup.alert({
            title: '获取图书失败!',
            template: res.err
        }).then(function(){
          $state.go('tab.booklist');
        });
      }
    })
  }
  $ionicModal.fromTemplateUrl('/templates/slider-modal.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.slideModal = modal;
  })
  $scope.showSlideModal = function(index){
    console.log('show modal');
    $scope.slideModal.show();
  }

  $scope.closeSlideModal = function() {
    $scope.slideModal.hide();
  };

  $ionicModal.fromTemplateUrl('/templates/map-modal.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.mapModal = modal;
  })
  $scope.showMapModal = function(pos){
    var mapObj;
    $scope.mapModal.show().then(function(){
        mapObj = Map.mapInit({
          longitude:$scope.book.lnglat[0],
          latitude:$scope.book.lnglat[1]
        });
        Map.initGeolocation(mapObj);
    })
  }
  $scope.closeMapModal = function(){
    $scope.mapModal.hide();
  }

  document.addEventListener("deviceready", function () {
    var scheme;
    $cordovaAppAvailability.check('twitter://')
      .then(function() {
        // is available
      }, function () {
        // not available
      });
  }, false);

  $scope.borrow = function(){
    Api.borrowBook({
      ownerId:$scope.user._id,
      bookId:$scope.book._id,
      borrowerId:$scope.curUser._id
    }).then(function(res){
      if(res.status == 0){
        $ionicPopup.alert({
          title: '结束申请发送成功'
        }).then(function(){
          $state.go('tab.booklist');
        });
      }
    })
  }
}])

.controller('ChatsCtrl', ['$scope', 'Chats', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
}])

.controller('ChatDetailCtrl', ['$scope', '$stateParams', 'Chats', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
}])

.controller('AccountCtrl', ['$scope', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
}])

angular.module('starter.services', ['angular-jwt'])
    .factory('Map', function() {
        var mapObj={};
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
            try{
                setMaker(mapObj, pos);
                var lg = new AMap.LngLat(pos.longitude, pos.latitude);
                mapObj.setCenter(lg);
            } catch (e){

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
        var getLngLatInfo = function(pos,geocoder_callBack){
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
            getLngLatInfo:getLngLatInfo
        }
    })
    .factory('Api', ['$http', 'ApiEndpoint', function($http, ApiEndpoint) {

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
            },
            borrowBook: function(data) {
                return $http({
                    method: 'POST',
                    url: ApiEndpoint + '/book/borrowBook',
                    data: data
                }).then(function(res) {
                    return res.data;
                })
            }
        }
    }])
    .factory('jsonpInterceptor', ['$timeout', '$window', function($timeout, $window) {
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
    }])
    .service('UserService', ['$http', 'ApiEndpoint', '$window', '$state', 'jwtHelper', function($http, ApiEndpoint, $window, $state, jwtHelper) {
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
            getUser: function() {
                return JSON.parse($window.localStorage.user);
            }
        }
    }])


angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("book-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddBookModal()\"></a>\n        <h1 class=\"title\">添加图书</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-img-add\">\n            <ul ng-show=\"prevImgList.length\" class=\"img-prev\">\n                <li class=\"prev-item\" ng-repeat=\"imgUrl in prevImgList\" >\n                    <img ng-src=\"{{imgUrl | addserverhost}}\" class=\"prev-img\">\n                </li>\n            </ul>\n            <ion-spinner ng-show=\"bookInfo.loading\"></ion-spinner>\n            <span class=\"img-add-block\" ng-show=\"!bookInfo.loading && prevImgList.length <= 3\">\n                <em class=\"icon ion-ios-plus-empty img-add-icon\"></em>\n                <div class=\"img-input-wrap\">\n                <form action={{addNewBookAction}} enctype=\"multipart/form-data\" class=\"img-add-input\">\n                    <input type=\"file\" accept=\"image/x-png, image/gif, image/jpeg\" class=\"img-add-input\" onchange=\"angular.element(this).scope().fileChange(this)\">\n                </form>\n                </div>\n            </span>\n        </label>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"书名\" name=\"name\" ng-model=\"bookInfo.bookName\" ng-change=\"getDoubanInfo()\">\n        </label>\n        <ul class=\"list\" ng-show=\"doubanSuggestShow\">\n            <li class=\"item\" ng-repeat=\"book in doubanSuggestBooks\" ng-click=\"doubanBookSelected($index)\">\n                <h2>{{book.title}}</h2>\n                <p>作者:{{book.author[0]}},价格:{{book.price}},<strong>评分:{{book.rating.average}}</strong></p>\n            </li>\n        </ul>\n        <label class=\"item item-input\">\n            <textarea name=\"\" rows=\"3\" placeholder=\"描述\" name=\"desc\" ng-model=\"bookInfo.bookDesc\"></textarea>\n        </label>\n        <label class=\"item\">\n            <span>豆瓣评分</span>\n            <span class=\"badge badge-energized\">{{bookInfo.doubanRating}}</span>\n        </label>\n        <div class=\"item\" ng-click=\"triggeLocationShow()\">\n            <span class=\"input-label\">地点:{{location.name}}</span>\n        </div>\n        <ul class=\"user-location list\" ng-show=\"showLocation\">\n            <li class=\"item\" ng-repeat=\"ul in usrLocations track by $index\" ng-click=\"selectSuggestLocation($index)\">{{ul.name}}</li>\n            <li class=\"item\" ng-click=\"openAddLocationModal()\">添加新地址</li>\n        </ul>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitNew()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("book-detail.html","<ion-view view-title=\"{{book.name}}\" name=\"book-detail\" animation=\"slide-left-right\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n    </ion-nav-buttons>\n    <ion-content>\n        <ion-slide-box>\n            <ion-slide ng-repeat=\"img in book.bookImgs\" does-continue=\"true\">\n                <div class=\"img-slider-wrap\" style=\"background:url({{img|addserverhost}}) no-repeat;background-size:cover;\" ng-click=\"showSlideModal($index)\">\n                    <div class=\"img-slider-mask\">\n                    </div>\n                </div>\n            </ion-slide>\n        </ion-slide-box>\n        <div class=\"book-info\">\n            <h3 class=\"title\">{{book.name}}</h3>\n            <div class=\"book-user-info\">\n                <img src=\"../img/user1.jpg\" alt=\"\" class=\"avatar\">\n                <div>{{user.name}}</div>\n            </div>\n            <div class=\"book-desc\">{{book.desc}}</div>\n            <div class=\"card douban-info\">\n                <div class=\"item item-text-wrap\" ng-click=\"summaryShow=!summaryShow\">\n                    <span>豆瓣评分：</span>\n                    <span class=\"badge badge-assertive rating\">{{book.doubanInfo.rating}}</span>\n                    <span class=\"ion accordion-icon\" ng-class=\"{\'ion-ios-arrow-up\':summaryShow,\'ion-ios-arrow-down\':!summaryShow}\"></span>\n                </div>\n                <p class=\"item item-text-wrap\" ng-show=\"summaryShow\">内容简介：{{book.doubanInfo.summary}}</p>\n            </div>\n            <div class=\"hr\">\n                <span>取物地址</span>   \n            </div>\n            <img ng-src=\"{{book.locationImg}}\" alt=\"\" class=\"book-location-img\" ng-click=\"showMapModal()\">\n        </div>\n    </ion-content>\n    <ion-footer-bar class=\"bar\" ng-show=\"curUser._id != user._id\">\n        <button class=\"button button-balanced button-large pull-right\" id=\"borrowBtn\" ng-click=\"borrow()\">我想借</button>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("chat-detail.html","<!--\n  This template loads for the \'tab.friend-detail\' state (app.js)\n  \'friend\' is a $scope variable created in the FriendsCtrl controller (controllers.js)\n  The FriendsCtrl pulls data from the Friends service (service.js)\n  The Friends service returns an array of friend data\n-->\n<ion-view view-title=\"{{chat.name}}\">\n  <ion-content class=\"padding\">\n    <img ng-src=\"{{chat.face}}\" style=\"width: 64px; height: 64px\">\n    <p>\n      {{chat.lastText}}\n    </p>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("location-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddLocationModal()\"></a>\n        <h1 class=\"title\">添加地址</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"输入地址\" name=\"name\" ng-model=\"location.name\" ng-change=\"inputChange()\">\n        </label>\n        <ul id=\"tipResult\" class=\"list\" ng-show=\"tipResult.length > 0\">\n            <li ng-repeat=\"tip in tipResult\" class=\"item\" ng-click=\"selectLocation(tip)\">{{tip.name}} <em class=\"item-note\">{{tip.district}}</em></li>\n        </ul>\n        <div id=\"mapContainer\" class=\"item\">\n            \n        </div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitLocation()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("login.html","<ion-view view-title=\"登陆\" name=\"login-view\" animation=\"slide-left-right\">\n  <ion-content>\n      <div class=\"list\">\n          <label class=\"item item-input\">\n              <input type=\"text\" placeholder=\"用户名或手机号\" ng-model=\"data.username\">\n          </label>\n          <label class=\"item item-input\">\n              <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n          </label>\n      </div>\n      <div class=\"padding\">\n        <button class=\"button button-block button-calm\" ng-click=\"login()\">登陆</button>\n      </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("map-modal.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeMapModal()\"></a>\n        <h1 class=\"title\">地图</h1>\n    </ion-header-bar>\n    <ion-content>\n        \n        <div id=\"mapContainer\" class=\"item full-map\">\n            \n        </div>\n        \n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("signin.html","<ion-view view-title=\"注册\" name=\"signin-view\">\n    <ion-content>\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <input type=\"text\" placeholder=\"用户名\" ng-model=\"data.name\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"tel\" placeholder=\"手机号\" ng-model=\"data.phone\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"再次输入您的密码\" ng-model=\"data.password2\">\n            </label>\n            <label class=\"item assertive\" ng-show=\"err\">\n              {{err}}\n            </label>\n        </div>\n        <div class=\"padding\">\n          <button class=\"button button-block button-calm padding\" ng-click=\"signin()\">登陆</button>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("slider-modal.html","<div class=\"modal image-modal transparent\" ng-click=\"closeSlideModal()\">\n    <ion-slide-box>\n        <ion-slide ng-repeat=\"oImage in book.bookImgs\">\n            <img ng-src=\"{{oImage|addserverhost}}\" class=\"fullscreen-image\" />\n        </ion-slide>\n    </ion-slide-box>\n</div>\n");
$templateCache.put("tab-account.html","<ion-view view-title=\"我\">\n  <ion-content class=\"has-header\">\n	<a href=\"#login\" class=\"button button-block button-calm\">登陆</a>\n	<a href=\"#signin\" class=\"button button-block button-balanced\">注册</a>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-booklist.html","<ion-view view-title=\"邻书\" align-title=\"center\">\n<!--     <ion-nav-buttons side=\"primary\">\n        <a class=\"button button-icon icon ion-map\"></a>\n    </ion-nav-buttons>\n -->    <ion-nav-buttons side=\"secondary\">\n        <a class=\"button button-icon icon ion-plus-round\" ng-click=\"openAddBookModal()\"></a>\n    </ion-nav-buttons>\n    <ion-content>\n        <div class=\"list card\" ng-repeat=\"book in booklist\">\n            <div class=\"item item-avatar\">\n                <img src=\"../img/user1.jpg\" alt=\"\">\n                <h2>{{book.name}}</h2>\n            </div>\n            <a class=\"item item-thumbnail-left\" ui-sref=\"bookdetail({id:book._id})\">\n                <img ng-src=\"{{book.bookImgs[0] | addserverhost}}\">\n                <h2>{{book.name}}</h2>\n                <p>{{book.desc}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-messages.html","<ion-view view-title=\"我的消息\">\n    <ion-content class=\"has-header\">\n        <div class=\"list\">\n            <a class=\"item item-avatar\" href=\"#\">\n                <img src=\"img/user1.jpg\">\n                <h2>jianbo</h2>\n                <p>我的消息</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tabs.html","<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"tabs-icon-top tabs-color-active-positive\">\n    <!-- Booklist Tab -->\n    <ion-tab title=\"附近\" icon-off=\"ion-ios-bookmarks-outline\" icon-on=\"ion-ios-bookmarks\" href=\"#/tab/booklist\">\n        <ion-nav-view name=\"tab-booklist\"></ion-nav-view>\n    </ion-tab>\n    <!-- Collections Tab -->\n    <ion-tab title=\"精选\" icon-off=\"ion-ios-star-outline\" icon-on=\"ion-ios-star\" href=\"#/tab/collections\">\n        <ion-nav-view name=\"tab-collections\"></ion-nav-view>\n    </ion-tab>\n    <!-- Chats Tab -->\n    <ion-tab title=\"消息\" icon-off=\"ion-ios-chatboxes-outline\" icon-on=\"ion-ios-chatboxes\" href=\"#/tab/messages\">\n        <ion-nav-view name=\"tab-messages\"></ion-nav-view>\n    </ion-tab>\n    <!-- Account Tab -->\n    <ion-tab title=\"我\" icon-off=\"ion-ios-person-outline\" icon-on=\"ion-ios-person\" href=\"#/tab/account\">\n        <ion-nav-view name=\"tab-account\"></ion-nav-view>\n    </ion-tab>\n</ion-tabs>\n");}]);