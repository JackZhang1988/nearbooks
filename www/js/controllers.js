angular.module('starter.controllers', [])

.controller('BookListCtrl',function($scope,$state,$ionicModal,$ionicPopup,$timeout,$ionicLoading,$cordovaGeolocation,$ionicPlatform, ApiEndpoint ,Api, Map,UserService){

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
        userId:$scope.user._id
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
    $scope.addLocationModal.show().then(function(){
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
              mapObj = Map.mapInit(pos.coords);
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
    // $scope.selectedLocation = $scope.location;
    $scope.location.name = tip.name;
  }
  $scope.submitLocation = function(){
    $ionicLoading.show();
    Api.addLocation({
      userId:'mockId',
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
.controller('BookDetailCtrl',function($scope,$state,$stateParams,$ionicPopup,$ionicSlideBoxDelegate,$ionicModal,Api){
	$scope.book = {};
  if(!$stateParams.id){
    $state.go('/');
  }else{
    Api.getBookById($stateParams.id).then(function(res){
      if(res.status == 0){
        $scope.book = res.data;
        $ionicSlideBoxDelegate.update();
      }else{
        $ionicPopup.alert({
            title: '获取图书失败!',
            template: res.err
        }).then(function(){
          $state.go('/');
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
})

.controller('BookAddCtrl',function($scope){

})
.controller('MessagesCtrl',function($scope){

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

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
