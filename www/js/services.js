angular.module('starter.services', [])
    .factory('Map',function(){
        var mapObj;
        var mapInit = function(pos) {
            mapObj = new AMap.Map('mapContainer', {
                rotateEnable: true,
                dragEnable: true,
                zoomEnable: true,
                zooms: [3, 18],
                zoom: 15,
                //二维地图显示视口
                view: new AMap.View2D({
                    zoom: 13, //地图显示的缩放级别,
                    center: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null
                })
            });
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
            return mapObj;
        }
        var initAutoSearch = function(keywords,autoOptions,success,fail){
            var auto;
            AMap.service(["AMap.Autocomplete"],function(){
                auto = new AMap.Autocomplete(autoOptions);
                if(keywords.length > 0){
                    auto.search(keywords, function(status, result){
                        success(result);
                    })
                }else{
                    fail&&fail();
                }
            })
        }
        var citySearch  = function(success,fail){
            AMap.service(["AMap.CitySearch"], function() {
                //实例化城市查询类
                var citysearch = new AMap.CitySearch();
                //自动获取用户IP，返回当前城市
                citysearch.getLocalCity(function(status, result){
                    if(status === 'complete' && result.info === 'OK'){
                        if(result && result.city && result.bounds) {
                            success(result);
                        }
                    }else{
                        fail && fail();
                    }
                });
            });
        }
        var setMaker = function(mapObj,pos){
            var marker = new AMap.Marker({ //创建自定义点标注                 
                map: mapObj,
                position: pos ? new AMap.LngLat(pos.longitude, pos.latitude) : null,
                offset: new AMap.Pixel(-10, -34),
                icon: "http://webapi.amap.com/images/0.png"
            });
        }
        var setCenter =function(mapObj,pos){
            setMaker(mapObj,pos);
            var lg = new AMap.LngLat(pos.longitude,pos.latitude);
            mapObj.setCenter(lg);
        }
        return {
            mapInit:mapInit,
            initAutoSearch:initAutoSearch,
            citySearch:citySearch,
            setMaker:setMaker,
            setCenter:setCenter
        }
    })
    .factory('Api',function($http, ApiEndpoint){
        var addNewBook = function(data){
            return $http({
                method:'POST',
                url:ApiEndpoint+'/book',
                data:data
            }).then(function(res){
                return res.data;
            });
        }
        var addBookImg = function(imgData){
            return $http({
                method:'POST',
                url:ApiEndpoint+'/book/bookImg',
                data:imgData,
                headers : { 'Content-Type': undefined },
                transformRequest:angular.identity
            });
        }
        var addLocation = function(location){
            return $http({
                method:'POST',
                url:ApiEndpoint+'/user/location',
                data:location
            }).then(function(res){
                return res.data;
            })
        }
        return {
            addNewBook:addNewBook,
            addBookImg:addBookImg,
            addLocation:addLocation
        }
    })
    .factory('Booklist', function() {
        var Booklist = [{
            id: 1,
            bookname: "关灯吃面",
            image: ["http://img3.douban.com/lpic/s28051611.jpg"],
            writer: "xueqiu",
            sharefrom: '剑波',
            price: 49.8
        }, {
            id: 2,
            bookname: "写给大家看的设计书（第三版）",
            image: ["http://img3.douban.com/lpic/s23486434.jpg"],
            writer: "Robin Williams",
            sharefrom: '剑波',
            price: 49
        }, {
            id: 3,
            bookname: "创业维艰",
            image: ["http://img3.douban.com/lpic/s28003074.jpg"],
            writer: "本·霍洛维茨 Ben Horowitz ",
            sharefrom: 'Dylan',
            price: 49
        }, {
            id: 4,
            bookname: "设计中的设计",
            image: ["http://img3.douban.com/lpic/s2165932.jpg"],
            writer: "[日] 原研哉 ",
            sharefrom: '剑波',
            price: 48
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: 'Dylan',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: 'Dylan',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: 'Dylan',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: 'Dylan',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: 'Dylan',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: '剑波',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: '剑波',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: '剑波',
            price: 39.5
        }, {
            id: 5,
            bookname: "解忧杂货店",
            image: ["http://img4.douban.com/lpic/s27284878.jpg"],
            writer: "(日)东野圭吾 ",
            sharefrom: '剑波',
            price: 39.5
        }];

        return {
            all: function() {
                return Booklist;
            },
            get: function(bookId) {
                for (var i = 0, j = Booklist.length; i < j; i++) {
                    if (Booklist[i].id === parseInt(bookId)) {
                        return Booklist[i];
                    }
                }
                return null;
            }
        }
    })