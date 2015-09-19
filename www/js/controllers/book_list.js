angular.module('starter.controllers')
    .controller('BookListCtrl', function($scope, $state, $ionicModal, $ionicPopup, $timeout, $ionicLoading, $cordovaGeolocation, $ionicPlatform, $timeout, ApiEndpoint, ImgUrl, Api, Map, UserService) {
        $scope.platform = ionic.Platform.platform();
        var lnglat = {};
        $ionicPlatform.ready(function() {
            var posOptions = {
                timeout: 3000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation
                .getCurrentPosition(posOptions)
                .then(function(position) {
                    lnglat = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    Api.getAllBooks(lnglat).then(function(res) {
                        $ionicLoading.hide();
                        if (res.status == 0) {
                            $scope.booklist = res.data;
                        }
                    })
                }, function(err) {
                    // error
                    Api.getAllBooks().then(function(res) {
                        $ionicLoading.hide();
                        if (res.status == 0) {
                            $scope.booklist = res.data;
                        }
                    })
                });


        });
        // $scope.booklist = Booklist.all(); // mock data
        $scope.booklist = [];
        $ionicLoading.show();

        // 添加图片列表
        $scope.prevImgList = [];
        // 添加的图书信息
        $scope.bookInfo = {};

        $scope.location = {};

        // 添加图片的接口地址
        $scope.addNewBookAction = ApiEndpoint + '/bookImg';
        // 用户保存过得位置信息，从localStorage 读取
        $scope.usrLocations = JSON.parse(window.localStorage.getItem('commonLocation')) || [];
        // 用户当前选择的地理信息
        $scope.selectedLocation = $scope.usrLocations[0];
        if ($scope.usrLocations.length) {
            $scope.location.name = $scope.usrLocations[0].name;
            $scope.selectedLocation = $scope.usrLocations[0];
            // $scope.schedule.locationName = $scope.usrLocations[0].name; 
        }

        $ionicModal.fromTemplateUrl('book-add.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            $scope.addBookModal = modal;
        });

        $scope.showAddActionList = false;
        $scope.toggleAddActionList = function($event) {
            //打开添加图书、添加行程列表
            if ($event.currentTarget.className.indexOf('item') == -1) {
                $scope.showAddActionList = !$scope.showAddActionList;
            }
        }

        $scope.getDoubanInfo = function() {
            Api.getDoubanInfo($scope.bookInfo.bookName).then(function(res) {
                $scope.doubanSuggestShow = true;
                $scope.doubanSuggestBooks = res.books;
            })
        }

        $scope.doubanBookSelected = function(index) {
            $scope.doubanSuggestShow = false;
            var doubanBook = $scope.doubanSuggestBooks[index];
            $scope.bookInfo.bookName = doubanBook.title;
            $scope.bookInfo.writer = doubanBook.author[0];
            $scope.bookInfo.price = doubanBook.price;
            $scope.bookInfo.doubanUrl = doubanBook.alt;
            $scope.bookInfo.summary = doubanBook.summary;
            $scope.bookInfo.doubanRating = doubanBook.rating.average;
        }

        $scope.fileChange = function(element) {
            var imgFile = element.files[0];
            $scope.bookInfo.loading = true;
            var fd = new FormData();
            fd.append('file', element.files[0]);
            Api.addBookImg(fd).success(function(res) {
                console.log(res);
                if (res.status == 0) {
                    $scope.bookInfo.loading = false;
                    // $scope.bookImgList = res.data.url;
                    $scope.prevImgList.push(res.data.url)
                }
            }).error(function(err) {
                $scope.bookInfo.loading = false;
            })
        }
        $scope.openAddBookModal = function() {
            if (UserService.isLogin()) {
                $scope.prevImgList = [];
                $scope.bookInfo = {};
                $scope.addBookModal.show();
                $scope.user = UserService.getUser();
            } else {
                UserService.doLogin();
            }
        }

        $scope.closeAddBookModal = function() {
            $scope.addBookModal.hide();
        }

        function validate() {
            if ($scope.prevImgList.length <= 0) {
                return '至少上传一张图片!';
            }
            if (!$scope.bookInfo.bookName) {
                return '请填写图书名!';
            }
            if (!$scope.selectedLocation) {
                return '请填写图书位置信息';
            }
            return 1;
        }
        $scope.submitNew = function() {
            console.log('submitNew');
            var validateResut = validate();
            if (validateResut === 1) {
                $ionicLoading.show();

                Api.addNewBook({
                    bookImgs: $scope.prevImgList,
                    bookName: $scope.bookInfo.bookName,
                    bookDesc: $scope.bookInfo.bookDesc,
                    doubanInfo: {
                        writer: $scope.bookInfo.writer,
                        price: $scope.bookInfo.price,
                        url: $scope.bookInfo.doubanUrl,
                        summary: $scope.bookInfo.summary,
                        rating: $scope.bookInfo.doubanRating
                    },
                    lnglat: $scope.selectedLocation.lnglat,
                    _user: $scope.user._id
                }).success(function(res) {
                    $ionicLoading.hide();
                    if (res.status == 0) {
                        var submitAlert = $ionicPopup.alert({
                            title: '提交成功',
                            okText: '确定'
                        });
                        submitAlert.then(function() {
                            $scope.addBookModal.hide();
                        })
                        $timeout(function() {
                            submitAlert.close();
                            $scope.addBookModal.hide();
                        }, 3000)
                    } else {
                        $ionicPopup.alert({
                            title: res.err
                        });
                    }
                })

            } else {
                $ionicPopup.alert({
                    title: validateResut
                });
            }
        }


        $ionicModal.fromTemplateUrl('modal-location-add.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.addLocationModal = modal;
        });

        var mapObj;
        $scope.openAddLocationModal = function() {
            $scope.selectedLocation = {};
            $scope.addLocationModal.show().then(function() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(pos) {
                        mapObj = Map.mapInit(pos.coords);
                        $scope.selectedLocation.lnglat = [pos.coords.longitude, pos.coords.latitude];
                        Map.getLngLatInfo(pos.coords, function(result) {
                            $scope.selectedLocation.name = result.regeocode.formattedAddress;
                            $scope.location.name = result.regeocode.formattedAddress;
                        })
                        Map.citySearch(function(result) {
                            $scope.curCity = result.city;
                        })
                    }, function(error) {
                        // 手机未插入Sim卡时，无法获得地理位置信息
                        alert('无法获得您的位置信息');
                        $scope.addLocationModal.hide();
                        $scope.addBookModal.hide();
                        $scope.addScheduleModal.hide();
                    }, {
                        // maximumAge: 0,
                        enableHighAccuracy: false,
                        timeout: 3000
                    });
                } else {}

            });
        }
        $scope.closeAddLocationModal = function() {
            $scope.addLocationModal.hide();
        }
        $scope.inputChange = function() {
            var ops = {
                city: $scope.curCity || ''
            }
            Map.initAutoSearch($scope.location.name, ops, function(result) {
                $scope.tipResult = result.tips
            }, function() {
                $scope.tipResult = [];
            })
        }
        $scope.selectLocation = function(tip) {
            $scope.location = tip.location;
            Map.setCenter(mapObj, {
                longitude: $scope.location.lng,
                latitude: $scope.location.lat
            })
            $scope.tipResult = [];
            $scope.selectedLocation = $scope.location;
            $scope.location.name = tip.name;
        }
        $scope.submitLocation = function() {
            $ionicLoading.show();
            Api.addLocation({
                    _user: $scope.user._id,
                    name: $scope.selectedLocation.name,
                    lng: $scope.selectedLocation.lng,
                    lat: $scope.selectedLocation.lat
                }).then(function(res) {
                    $ionicLoading.hide();
                    if (res.status == 0) {
                        $scope.usrLocations.push(res.data);
                        window.localStorage.setItem('commonLocation', JSON.stringify($scope.usrLocations));
                        $scope.addLocationModal.hide();
                        $scope.showLocation = false;
                    }
                })
                // $scope.bookInfo.location = $scope.selectedLocation;
        }
        $scope.showLocation = false;
        $scope.triggeLocationShow = function() {
            $scope.showLocation = !$scope.showLocation;
        }
        $scope.selectSuggestLocation = function(index) {
            $scope.location = $scope.usrLocations[index];
            $scope.showLocation = false;
        }

        // Add Schedule
        $ionicModal.fromTemplateUrl('schedule-add.html', {
            scope: $scope,
            animation: 'slide-in-up',
            focusFirstInput: true
        }).then(function(modal) {
            $scope.addScheduleModal = modal;
        });

        $scope.schedule = {};

        $scope.openAddScheduleModal = function() {
            if (UserService.isLogin()) {
                $scope.schedule = {};
                $scope.user = UserService.getUser();
                $scope.addScheduleModal.show();
            } else {
                UserService.doLogin();
            }
        }
        $scope.closeAddScheduleModal = function() {
            $scope.addScheduleModal.hide();
        }
        var validateSchedule = function() {
            if (!$scope.schedule.desc) {
                return '请输入行程描述';
            } else if (!$scope.schedule.starttime) {
                return '请输入开始时间';
            } else if ($scope.schedule.starttime < new Date()) {
                return '开始时间已经过去了';
            } else if (!$scope.schedule.endtime) {
                return '请输入结束时间';
            } else if ($scope.schedule.starttime >= $scope.schedule.endtime) {
                return '开始时间不能大于结束时间';
            } else if (!$scope.selectedLocation.lnglat) {
                return '请选择行程地理位置';
            } else {
                return false;
            }
        }
        $scope.addSchedule = function() {
            console.log($scope.schedule);
            var validateResut = validateSchedule();
            if (!validateResut) {
                UserService.addSchedule({
                    userId: $scope.user._id,
                    desc: $scope.schedule.desc,
                    starttime: $scope.schedule.starttime,
                    endtime: $scope.schedule.endtime,
                    locationName:$scope.selectedLocation.name,
                    lnglat: $scope.selectedLocation.lnglat
                }).then(function(res) {
                    if (res.status == 0) {
                        var addScheduleAlert = $ionicPopup.alert({
                            title: '添加行程成功'
                        });
                        addScheduleAlert.then(function() {
                            $scope.addScheduleModal.hide();
                        });
                        $timeout(function() {
                            addScheduleAlert.close();
                            $scope.addScheduleModal.hide();
                        }, 3000);
                    }
                })
            } else {
                $ionicPopup.alert({
                    title: validateResut
                });
            }
        }
    })
