angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('BookListCtrl',function($scope,$state,$ionicModal,$ionicPopup,$timeout,$ionicLoading,ApiEndpoint, Booklist, Api, Map){
	$scope.booklist = Booklist.all();
	$scope.goDetail = function(bookId){
		$state.go('tab.book-detail',{bookId:bookId});
	}	
  $scope.prevImgList = [];
  $scope.bookInfo = {};

  $ionicModal.fromTemplateUrl('/templates/book-add.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.addBookModal = modal;
  });

  $scope.addNewBookAction = ApiEndpoint+'/bookImg';

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
    $scope.prevImgList = [];
    $scope.bookInfo={};
    $scope.addBookModal.show();
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
        bookDesc:$scope.bookInfo.bookDesc
      }).success(function(res){
        $ionicLoading.hide();
        if(res.status == 0){
          var submitAlert = $ionicPopup.alert({
            title:'提交成功',
            okText:'确定'
          });
          submitAlert.then(function(res){
            $scope.modal.hide();
          })
          $timeout(function(){
            submitAlert.close();
            $scope.modal.hide();
          },5000)
        }else{
          $ionicPopup.alert({title:res.err});
        }
      })
      
    }else{
      $ionicPopup.alert({title:validateResut});
    }
  }


  $scope.location = {};
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
    $scope.location.geo = tip.location.split(',');
    Map.setCenter(mapObj,{
      longitude:$scope.location.geo[0],
      latitude:$scope.location.geo[1]
    })
    $scope.tipResult = [];
    $scope.selectedLocation = $scope.location;
    $scope.location.name = tip.name;
  }
  $scope.usrLocations = JSON.parse(window.localStorage.getItem('commonLocation'))||[];
  if($scope.usrLocations.length){
   $scope.location.name = $scope.usrLocations[0].name; 
  }
  $scope.submitLocation = function(){
    $ionicLoading.show();
    Api.addLocation({
      userId:'mockId',
      name:$scope.selectedLocation.name,
      lng:$scope.selectedLocation.geo[0],
      lat:$scope.selectedLocation.geo[1]
    }).then(function(res){
      $ionicLoading.hide();
      if(res.status == 0){
        $scope.usrLocations.push(res.data);
        window.localStorage.setItem('commonLocation',JSON.stringify($scope.usrLocations));
        $scope.addLocationModal.hide();
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
.controller('BookDetailCtrl',function($scope,$stateParams,Booklist){
	$scope.book = Booklist.get($stateParams.bookId);
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
