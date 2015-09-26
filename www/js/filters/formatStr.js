angular.module('starter.filter')
    .filter('formatStr', function() {
        return function(data,type) {
        	switch(type){
        		case 'dis':
        			if(data >= 1){
        				return data.toFixed(1)+' km';
        			}else{
	        			return Math.floor(data*1000);
        			}
        		default:
        			return data;
        	}
        };
    })