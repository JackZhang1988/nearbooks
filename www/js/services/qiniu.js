angular.module('starter.services')
    .factory('QiniuService', function($http, $q, ApiEndpoint) {
        return {
            getQiniuToken:function(){
                var token = window.localStorage.getItem('qiniu_token');
                var tokenTime = window.localStorage.getItem('qiniu_token_time');
                var token = null;
                if(token && tokenTime && ((new Date()).getTime() -tokenTime) > 3600){
                    var deferred = $q.defer();
                    deferred.resolve(token);
                    return deferred.promise;
                }else{
                    return $http({
                        url:ApiEndpoint+'/qiniu/token',
                        method:'GET'
                    }).then(function(res){
                        if(res.data.status == 0){
                            window.localStorage.setItem('qiniu_token',res.data.token);
                            window.localStorage.setItem('qiniu_token_time',(new Date()).getTime());
                            return res.data.token;
                        }else{
                            return null;
                        }
                    })
                }
            },
            addImage:function(imgData){
                var deferred = $q.defer();

                this.getQiniuToken().then(function(token){
                    if(token){
                        var fd = new FormData();
                        fd.append('file', imgData);
                        fd.append('token',token);
                        $http({
                            method: 'POST',
                            url: 'http://up.qiniu.com/',
                            data: fd,
                            headers: {
                                'Content-Type': undefined
                            },
                            transformRequest: angular.identity
                        }).then(function(res){
                            deferred.resolve(res.data);
                        },function(err){
                            console.log(err);
                        });
                    }
                })
                return deferred.promise;
            }
        }
    })
