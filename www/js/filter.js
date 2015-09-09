angular.module('starter.filter', [])
    .filter('addserverhost', function(ImgUrl) {
        return function(url) {
            return ImgUrl + url;
        };
    })
    .filter('msgOutput', function() {
        return function(msg){
        	// todo: 优化时间格式，改为 xx天前 xx小时前
	        if (!msg) return null;
	        switch (msg.content.contentType) {
	            case 'book':
	                return '我想借《' + msg.content.info.bookName + '》';
	            case 'text':
	                return msg.content.info;
	            default:
	                return msg.content.info;
	        }
        }
    })
