angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('BookListCtrl',function($scope,$state,$ionicModal,Booklist){
	$scope.booklist = Booklist.all();
	$scope.goDetail = function(bookId){
		$state.go('tab.book-detail',{bookId:bookId});
	}	
  $ionicModal.fromTemplateUrl('/templates/book-add.html',{
    scope:$scope,
    animation:'slide-in-up'
  }).then(function(modal){
    $scope.modal = modal;
    $scope.prevImgList = [];
  })
  $scope.fileChange = function(element){
    var imgFile = element.files[0];
    var reader = new FileReader();
    reader.onload = function(e){
      $scope.$apply(function(){
        $scope.prevImgList.push(e.target.result);
      });
    }
    reader.readAsDataURL(imgFile);
  }
  $scope.openAddBookModal = function(){
    $scope.modal.show();
  }
  $scope.closeAddBookModal = function(){
    $scope.modal.hide();
  }
  $scope.submitNew = function(){
    alert('successed');
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
