angular.module('starter.controllers', [])
.controller('BookListCtrl',function($scope,$state,$ionicModal,$ionicPopup,$timeout,$ionicLoading,$cordovaGeolocation,$ionicPlatform, $timeout, ApiEndpoint, ImgUrl, Api, Map,UserService){

  var lnglat = {};
  $ionicPlatform.ready(function() {
      var posOptions = {
          timeout: 3000,
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
   $scope.selectedLocation = $scope.usrLocations[0];
   // $scope.Schedule.locationName = $scope.usrLocations[0].name; 
  }

  $ionicModal.fromTemplateUrl('/templates/book-add.html',{
    scope:$scope,
    animation:'slide-in-up',
    focusFirstInput:true
  }).then(function(modal){
    $scope.addBookModal = modal;
  });
  
  $scope.showAddActionList = false;
  $scope.toggleAddActionList = function($event){
    //打开添加图书、添加行程列表
    if($event.currentTarget.className.indexOf('item') == -1){
      $scope.showAddActionList = !$scope.showAddActionList;
    }
  }

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

  // Add Schedule
  $ionicModal.fromTemplateUrl('/templates/Schedule-add.html',{
    scope:$scope,
    animation:'slide-in-up',
    focusFirstInput:true
  }).then(function(modal){
    $scope.addScheduleModal = modal;
  });

  $scope.Schedule = {};

  $scope.openAddScheduleModal = function(){
    if(UserService.isLogin()){
      $scope.Schedule={};
      $scope.user = UserService.getUser();
      $scope.addScheduleModal.show();
    }else{
      UserService.doLogin();
    }
  }
  $scope.closeAddScheduleModal = function(){
    $scope.addScheduleModal.hide();
  }
  var validateSchedule = function(){
    if(!$scope.Schedule.desc){
      return '请输入行程描述';
    }else if(!$scope.Schedule.starttime){
      return '请输入开始时间';
    }else if($scope.Schedule.starttime < new Date()){
      return '开始时间已经过去了';
    }else if(!$scope.Schedule.endtime){
      return '请输入结束时间';
    }else if($scope.Schedule.starttime >= $scope.Schedule.endtime){
      return '开始时间不能大于结束时间';
    }else if(!$scope.selectedLocation.lnglat){
      return '请选择行程地理位置';
    }else {
      return false;
    }
  }
  $scope.addSchedule = function(){
    console.log($scope.Schedule);
    var validateResut = validateSchedule();
    if(!validateResut){
      UserService.addSchedule({
        userId:$scope.user._id,
        desc:$scope.Schedule.desc,
        starttime:$scope.Schedule.starttime,
        endtime:$scope.Schedule.endtime,
        lnglat:$scope.selectedLocation.lnglat
      }).then(function(res){
        if(res.status == 0){
          var addScheduleAlert = $ionicPopup.alert({title:'添加行程成功'});
          addScheduleAlert.then(function(){
            $scope.addScheduleModal.hide();
          });
          $timeout(function(){
            addScheduleAlert.close();
            $scope.addScheduleModal.hide();
          },3000);
        }
      })
    }else{
      $ionicPopup.alert({title:validateResut});
    }
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
            $window.location.reload(true);//re-bootstrap everything
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
.controller('SigninCtrl', function($scope,UserService,$ionicPopup,$state,$window){
    $scope.data={};
    $scope.err='';
    $scope.$watch('data',function(newValue, oldValue){
      if(newValue == oldValue){
        return;
      }
      if(!$scope.data.name){
        $scope.err = '用户名不能为空';
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
            $window.localStorage.token = res.token;
            $window.localStorage.user = JSON.stringify(res.user);
            $state.go('userinfo',{action:'sigin'});
            // var alertPopup = $ionicPopup.alert({
            //     title: '注册成功!'
            // });
            // alertPopup.then(function(){
            // })
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
.controller('UserInfoCtrl',function($scope,$state, $stateParams, UserService,ApiEndpoint){
  $scope.userInfo ={};
  $scope.curUser = UserService.getUser();
  $scope.signature = '';
  $scope.addUserImgAction = ApiEndpoint+'/user/userAvatar';
  if($stateParams.action =='update'){
    UserService.getUserInfo($scope.curUser._id).then(function(res){
      $scope.userInfo=res.user;
      $scope.avatarUrl = res.user.avatar;
    })
  }
  $scope.fileChange = function(element){
    var imgFile = element.files[0];
    $scope.loading = true;
    var fd = new FormData();
    fd.append('file',element.files[0]);
    UserService.addUserAvatar(fd).success(function(res){
      console.log(res);
      if(res.status == 0){
        $scope.loading=false;
        $scope.avatarUrl = res.data.url;
      }
    }).error(function(err){
      $scope.loading= false;
    })
  }
  $scope.updateUserInfo = function(){
    UserService.updateUserInfo({
      userId:$scope.curUser._id,
      sex:$scope.userInfo.sex,
      signature:$scope.userInfo.signature,
      avatarUrl:$scope.avatarUrl
    }).then(function(res){
      if(res.status == 0){
        $state.go('tab.booklist');
      }
    })
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
        if($scope.book.status == 'BORROWED'){
          $scope.bookActionStr = '借用中';
        }else{
          $scope.bookActionStr = '我想借';
        }
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

.controller('MessagesCtrl', function($scope,SocketService,Api,UserService){
  $scope.msgList = []; // todo: 合并相同用户的msg
  var user = UserService.getUser();
  if(user){
    // test socket
    // SocketService.on('init',function(msg){
    //    $scope.msgList[msg.id] = handleMsg(msg);
    // })
    SocketService.on('msg:borrow',function(msg){
       // $scope.msgList[msg.id] = handleMsg(msg);
       $scope.msgList.push(msg);
    });
    Api.getToUserMsgs(user._id).then(function(res){
      if(res.status == 0){
        $scope.msgList = $scope.msgList.concat(res.chatList);
        console.log($scope.msgList);
      }
    })
  }
})

.controller('ChatCtrl',function($scope,$state, $stateParams,$ionicPopup, $ionicScrollDelegate, $timeout, Api,UserService,SocketService){
  if($stateParams.sender){
    $scope.user = UserService.getUser();
    if($stateParams.sender == $scope.user._id){
      $ionicPopup.alert({
          title: '不能和自己聊天'
      }).then(function() {
          $state.go('tab.messages');
      });
      return;
    }

    $scope.toUser = {
      _id:$stateParams.sender,
      name:$stateParams.name
    }
    var chatUsers = [$stateParams.sender,$scope.user._id].sort();
    
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

    SocketService.on('msg:chat',function(res){
      $scope.messages.push({
        sender:res.sender,
        content:res.content
      })
      $timeout(function() {
        viewScroll.scrollBottom();
      }, 0);
    })

    SocketService.on('msg:borrow',function(msg){
       // $scope.msgList[msg.id] = handleMsg(msg);
       $scope.messages.push(msg);
    });

    $scope.sendMessage = function(){
      keepKeyboardOpen();
      $scope.messages.push({
        sender:$scope.user._id,
        content:{
          contentType:'text',
          info:$scope.input.message
        }
      });

      Api.sendChatMsg({
        chatUsers:chatUsers,
        sender:$scope.user._id,
        receiver:$scope.toUser._id,
        content:{
          contentType:'text',
          info:$scope.input.message
        }
      }).then(function(res){
        if(res.status == 0){
          console.log('消息发送成功',res.chat.content.info);
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
          $timeout(function() {
            viewScroll.scrollBottom();
          }, 0);
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

.controller('AccountCtrl', function($scope, $state, UserService, Api) {
  $scope.userInfo={};
  $scope.curUser = UserService.getUser();
  if($scope.curUser && $scope.curUser._id){
    UserService.getUserInfo($scope.curUser._id).then(function(res){
      if(res.status == 0){
        console.log(res.user);
        $scope.userInfo = res.user;
      }
    })
    Api.getUserBooks($scope.curUser._id).then(function(res){
      if(res.status == 0){
        console.log(res.books);
        $scope.userBooks = res.books;
      }
    })
  }else{
    $state.go('login');
  }
})

.controller('ConfigCtrl',function($scope,UserService){
  $scope.logout = function(){
    UserService.logout();
  }
})

.controller('BorrowHistoryCtrl', function($scope,$stateParams,$ionicPopup,Api,UserService){
  $scope.bHis = {};
  $scope.curUser = UserService.getUser();
  $scope.actionShow = true;
  if(!$stateParams.id){
    $state.go('/');
  }else{
    Api.getBorrowHistory($stateParams.id).then(function(res){
      if(res.statue == 0){
        $scope.bHis = res.bHis
        switch($scope.bHis.status){
          case 'ASK_BORROW':
            $scope.bHis.statusStr = '申请借用';
            break;
          case 'REFUSE_BORROW':
            if($scope.curUser._id == $scope.bHis.owner){
              $scope.bHis.statusStr = '你取消了申请';
            }else{
              $scope.bHis.statusStr = '对方取消了申请';
            }
            $scope.actionShow = false;
            break;
          case 'BORROWED':
            if($scope.curUser._id == $scope.bHis.owner){
              $scope.bHis.statusStr = '你同意了申请';
            }else{
              $scope.bHis.statusStr = '对方同意了申请';
            }
            break;
          default:
            $scope.bHis.statusStr = '';
            $scope.actionShow = false;
            break;
        }
      }
    })

    var confirmHandler = function(res,status){
      if (res) {
          Api.updateBorrowStatus({
              borrowId: $scope.bHis._id,
              status: status
          }).then(function(res) {
              if (res.status == 0) {
                  window.location.reload();
              }
          })
      }
    }
    $scope.refuseApply= function(){
      var confirmPopup = $ionicPopup.confirm({
          title: '你确定想要拒绝此次申请？',
          cancelText:'点错了',
          okText:'确定'
      });
      confirmPopup.then(function(res) {
          confirmHandler(res,'REFUSE_BORROW');
      });

    }
    $scope.agressApply = function(){
      var confirmPopup = $ionicPopup.confirm({
          title: '你确定同意此次申请？',
          cancelText:'点错了',
          okText:'确定'
      });
      confirmPopup.then(function(res) {
          confirmHandler(res,'BORROWED');
      });
    }
    $scope.cancelApply = function(){
      var confirmPopup = $ionicPopup.confirm({
          title: '你确定同意此次申请？',
          cancelText:'点错了',
          okText:'确定'
      });
      confirmPopup.then(function(res) {
          confirmHandler(res,'CANCEL_BORROW');
      });
    }
  }
})
