angular.module('starter.controllers', [])
.controller('BookListCtrl',function($scope,$state,$ionicModal,$ionicPopup,$timeout,$ionicLoading,$cordovaGeolocation,$ionicPlatform, $timeout, ApiEndpoint, ImgUrl, Api, Map,UserService){

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


  $ionicModal.fromTemplateUrl('/templates/modal-location-add.html',{
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
}) 
.controller('LoginCtrl', function($scope,UserService,$ionicPopup,$state,$window) {
    $scope.data = {};
 
    $scope.login = function() {
        UserService.loginUser({
            name: $scope.data.username,
            password: $scope.data.password
        }).then(function(res) {
          if(res.status == 0){
            $window.localStorage.token = res.token;
            $window.localStorage.user = JSON.stringify(res.user);
            $state.go('tab.account');
          }else{
            var alertPopup = $ionicPopup.alert({
                title: '登陆失败!',
                template: '请检查你的用户名和密码!'
            });
          }
        });
    }

})
.controller('SigninCtrl', function($scope,UserService,$ionicPopup,$state){
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
})
.controller('BookDetailCtrl',function($scope,$state,$stateParams,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,Api,Map,UserService){
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
  $ionicModal.fromTemplateUrl('/templates/modal-slider.html',{
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

  $ionicModal.fromTemplateUrl('/templates/modal-map.html',{
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
          title: '申请成功'
        }).then(function(){
          $state.go('tab.booklist');
        });
      }
    })
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('MessagesCtrl', function($scope,SocketService,UserService){
  $scope.msgList = {}; // todo: 合并相同用户的msg
  var user = UserService.getUser();
  function handleMsg(msg){
    // todo: 优化时间格式，改为 xx天前 xx小时前
    if(!msg) return null;
    switch(msg.content.contentType){
      case 'book':
        msg.output = '我想借《'+msg.content.info.bookName+'》';
        return msg;
      case 'text':
        msg.output = msg.content.info;
        return msg;
      default:
        msg.output = msg.content.info;
        return msg;
    }
  }
  if(user){
    SocketService.on('init',function(msg){
       $scope.msgList[msg.id] = handleMsg(msg);
    })
    SocketService.on('msg:borrow',function(msg){
       $scope.msgList[msg.id] = handleMsg(msg);
    })
  }
})

.controller('ChatCtrl',function($scope,$stateParams,$ionicPopup, $ionicScrollDelegate, $timeout, Api,UserService){
  if($stateParams.sender){
    $scope.user = UserService.getUser();
    var chatUsers = [$stateParams.sender,$scope.user._id].sort();
    // $scope.toUser  = $stateParams.sender;
    
    var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    var txtInput;
    $scope.messages =[];

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

    $scope.sendMessage = function(){
      keepKeyboardOpen();
      $scope.messages.push({
        chatUsers:chatUsers,
        sender:$scope.user._id,
        content:[{
          contentType:'text',
          info:$scope.input.message
        }]
      });
      Api.sendChatMsg({
        chatUsers:chatUsers,
        sender:$scope.user._id,
        content:{
          contentType:'text',
          info:$scope.input.message
        }
      }).then(function(res){
        if(res.status == 0){
          console.log('消息发送成功',res.chat.content[0].info);
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
        chatUsers:chatUsers
      }).then(function(res){
        if(res.status == 0){
          $scope.messages = res.chatList;
        }else{
          $ionicPopup.alert({
            title: '获取聊天信息失败'
          }).then(function(){
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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
