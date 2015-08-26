// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'addserverFilter'])

.constant('ApiEndpoint', 'http://192.168.1.103:3000/api')
.constant('ImgUrl','http://192.168.1.103:3000')

.run(function($ionicPlatform) {
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
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider, jwtInterceptorProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://192.168.1.103:3000/**'
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
            templateUrl: 'templates/signin.html'
        })
        .state('login', {
            url: '/login',
            controller: 'LoginCtrl',
            templateUrl: 'templates/login.html'
        })

    .state('bookdetail', {
            url: '/book/:id',
            templateUrl: 'templates/book-detail.html',
            controller: 'BookDetailCtrl'
        })
        // setup an abstract state for the tabs directive
        .state('tab', {
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })

    // Each tab has its own nav history stack:

    .state('tab.booklist', {
            url: '/booklist',
            views: {
                'tab-booklist': {
                    templateUrl: 'templates/tab-booklist.html',
                    controller: 'BookListCtrl'
                }
            }
        })
        // .state('tab.bookdetail', {
        //     url: '/book/:id',
        //     views: {
        //         'tab-booklist': {
        //             templateUrl: 'templates/book-detail.html',
        //             controller: 'BookDetailCtrl'
        //         }
        //     }
        // })
        .state('tab.messages', {
            url: '/messages',
            views: {
                'tab-messages': {
                    templateUrl: 'templates/tab-messages.html',
                    controller: 'MessagesCtrl'
                }
            }
        })
        // .state('tab.chat-detail', {
        //   url: '/chats/:chatId',
        //   views: {
        //     'tab-chats': {
        //       templateUrl: 'templates/chat-detail.html',
        //       controller: 'ChatDetailCtrl'
        //     }
        //   }
        // })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl'
            }
        },
        data: {
            requireLogin: true
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/booklist');

});
