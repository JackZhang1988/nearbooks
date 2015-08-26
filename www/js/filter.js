angular.module('addserverFilter', []).filter('addserverhost', function(ImgUrl) {
  return function(url) {
    return ImgUrl+url;
  };
});