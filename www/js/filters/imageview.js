angular.module('starter.filter')
    .filter('imageview', function() {
        return function(url,type) {
            switch(type){
            	case 'avatar':
            		return url+'?imageView2/1/w/100/h/100/q/75';
            	case 'thumbnail':
            		return url+'?imageView2/1/w/200/h/200/q/75';
                case 'mural':
                    return url+'?imageView2/1/w/400/h/400/q/75';
            	case 'origin':
            		return url+'?imageView2/1/w/960/h/960/q/75';
            	default:
            		return url;
            }
        };
    })