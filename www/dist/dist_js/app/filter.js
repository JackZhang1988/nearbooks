angular.module('addserverFilter', []).filter('addserverhost', ['ImgUrl', function(ImgUrl) {
  return function(url) {
    return ImgUrl+url;
  };
}]);