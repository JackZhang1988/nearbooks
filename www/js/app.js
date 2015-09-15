// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filter', 'starter.directive','ngCordova', 'templates','angular.filter'])

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
        .state('userinfo',{
            url:'/userinfo/:action',
            controller:'UserInfoCtrl',
            templateUrl:'userinfo.html'
        })
        .state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'login.html'
        })
        .state('config',{
            url:'/config',
            controller:'ConfigCtrl',
            templateUrl:'config.html'
        })
        .state('bookdetail', {
            url: '/book/:id',
            templateUrl: 'book-detail.html',
            controller: 'BookDetailCtrl'
        })
        
        .state('borrowhistory',{
            url:'/borrowhistory/:id',
            templateUrl:'borrow-history.html',
            controller:'BorrowHistoryCtrl'
        })
        .state('useraccount',{
            url:'/useraccount/:id',
            templateUrl:'tab-account.html',
            controller:'AccountCtrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "tabs.html"
        })
        // Each tab has its own nav history stack:
        .state('tab.collections', {
            url: '/collections',
            views: {
                'tab-collections': {
                    templateUrl: 'tab-collections.html',
                    controller: 'CollectionsCtrl'
                }
            }
        })
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
        .state('chat',{
            url:'/chat/:sender/:name',
            controller:'ChatCtrl',
            templateUrl:'chat-detail.html'
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
angular.module('starter.controllers', []);
angular.module('starter.directive', []);
angular.module('starter.filter', []);
angular.module('starter.services', ['angular-jwt']);