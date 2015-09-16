angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("book-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddBookModal()\"></a>\n        <h1 class=\"title\">添加图书</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-img-add\">\n            <ul ng-show=\"prevImgList.length\" class=\"img-prev\">\n                <li class=\"prev-item\" ng-repeat=\"imgUrl in prevImgList\" >\n                    <img ng-src=\"{{imgUrl | addserverhost}}\" class=\"prev-img\">\n                </li>\n            </ul>\n            <ion-spinner ng-show=\"bookInfo.loading\"></ion-spinner>\n            <span class=\"img-add-block\" ng-show=\"!bookInfo.loading && prevImgList.length <= 3\">\n                <em class=\"icon ion-ios-plus-empty img-add-icon\"></em>\n                <div class=\"img-input-wrap\">\n                <form action={{addNewBookAction}} enctype=\"multipart/form-data\" class=\"img-add-input\">\n                    <input type=\"file\" accept=\"image/x-png, image/gif, image/jpeg\" class=\"img-add-input\" onchange=\"angular.element(this).scope().fileChange(this)\">\n                </form>\n                </div>\n            </span>\n        </label>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"书名\" name=\"name\" ng-model=\"bookInfo.bookName\" ng-change=\"getDoubanInfo()\">\n        </label>\n        <ul class=\"list\" ng-show=\"doubanSuggestShow\">\n            <li class=\"item\" ng-repeat=\"book in doubanSuggestBooks\" ng-click=\"doubanBookSelected($index)\">\n                <h2>{{book.title}}</h2>\n                <p>作者:{{book.author[0]}},价格:{{book.price}},<strong>评分:{{book.rating.average}}</strong></p>\n            </li>\n        </ul>\n        <label class=\"item item-input\">\n            <textarea name=\"\" rows=\"3\" placeholder=\"描述\" name=\"desc\" ng-model=\"bookInfo.bookDesc\"></textarea>\n        </label>\n        <label class=\"item\">\n            <span>豆瓣评分</span>\n            <span class=\"badge badge-energized\">{{bookInfo.doubanRating}}</span>\n        </label>\n        <div class=\"item\" ng-click=\"triggeLocationShow()\">\n            <span class=\"input-label\">地点:{{location.name}}</span>\n        </div>\n        <ul class=\"user-location list\" ng-show=\"showLocation\">\n            <li class=\"item\" ng-repeat=\"ul in usrLocations track by $index\" ng-click=\"selectSuggestLocation($index)\">{{ul.name}}</li>\n            <li class=\"item\" ng-click=\"openAddLocationModal()\">添加新地址</li>\n        </ul>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitNew()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("book-detail.html","<ion-view view-title=\"{{book.name}}\" name=\"book-detail\" animation=\"slide-left-right\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\" ng-if=\"!isConfig\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n    </ion-nav-buttons>\n    <ion-content>\n        <ion-slide-box>\n            <ion-slide ng-repeat=\"img in book.bookImgs\" does-continue=\"true\">\n                <div class=\"img-slider-wrap\" style=\"background:url({{img|addserverhost}}) no-repeat;background-size:cover;\" ng-click=\"showSlideModal($index)\">\n                    <div class=\"img-slider-mask\">\n                    </div>\n                </div>\n            </ion-slide>\n        </ion-slide-box>\n        <div class=\"book-info\">\n            <h3 class=\"title\">{{book.name}}</h3>\n            <div class=\"book-user-info\">\n                <img src=\"../img/user1.jpg\" alt=\"\" class=\"avatar\">\n                <div>{{user.name}}</div>\n            </div>\n            <div class=\"book-desc\">{{book.desc}}</div>\n            <div class=\"card douban-info\">\n                <div class=\"item item-text-wrap\" ng-click=\"summaryShow=!summaryShow\">\n                    <span>豆瓣评分：</span>\n                    <span class=\"badge badge-assertive rating\">{{book.doubanInfo.rating}}</span>\n                    <span class=\"ion accordion-icon\" ng-class=\"{\'ion-ios-arrow-up\':summaryShow,\'ion-ios-arrow-down\':!summaryShow}\"></span>\n                </div>\n                <p class=\"item item-text-wrap\" ng-show=\"summaryShow\">内容简介：{{book.doubanInfo.summary}}</p>\n            </div>\n            <div class=\"hr\">\n                <span>取物地址</span>\n            </div>\n            <img ng-src=\"{{book.locationImg}}\" alt=\"\" class=\"book-location-img\" ng-click=\"showMapModal()\">\n        </div>\n    </ion-content>\n    <ion-footer-bar class=\"bar\" ng-show=\"curUser._id != user._id\">\n        <button class=\"button button-balanced button-large pull-right\" id=\"borrowBtn\" ng-click=\"borrow()\" ng-disabled=\"book.status != \'CAN_BORROW\'\">{{bookActionStr}}</button>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("borrow-history.html","<ion-view view-title=\"借用意向\" name=\"book-history\" animation=\"slide-left-right\">\n    <ion-content>\n        <div class=\"list card\">\n            <div class=\"item item-divider\">\n                {{bHis.statusStr}}\n            </div>\n            <div class=\"item item-avatar\">\n                <img src=\"../img/user2.png\">\n                <p>{{bHis.borrower.name}}</p>\n            </div>\n            <div class=\"item item-body\">\n                <h2>《{{bHis.book.name}}》</h2>\n                <img class=\"full-image\" ng-src=\"{{bHis.book.bookImgs[0] | addserverhost}}\">\n                <p>\n                    {{bHis.book.desc}}\n                </p>\n                <p>\n                    豆瓣评分：{{bHis.book.doubanInfo.rating}}\n                </p>\n            </div>\n        </div>\n    </ion-content>\n    <ion-footer-bar class=\"button-bar\" ng-show=\"actionShow\">\n        <div class=\"button-bar\" borrow-action>\n        </div>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("chat-detail.html","<ion-view id=\"userMessagesView\" cache-view=\"false\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n        <div class=\"title\">\n            <i class=\'icon ion-chatbubble user-messages-top-icon\'></i>\n            <div class=\'msg-header-username\'>{{toUser.name}}</div>\n        </div>\n    </ion-nav-buttons>\n    <div class=\"loader-center\" ng-if=\"!doneLoading\">\n        <div class=\"loader\">\n            <i class=\"icon ion-loading-c\"></i>\n        </div>\n    </div>\n    <ion-content has-bouncing=\"true\" class=\"has-header has-footer\" delegate-handle=\"userMessageScroll\">\n        <div ng-repeat=\"message in messages\" class=\"message-wrapper\">\n            <div ng-if=\"message.content.contentType != \'borrow_history\' && user._id !== message.sender\">\n                <img class=\"profile-pic left\" src=\"../img/user2.png\" />\n                <div class=\"chat-bubble left\">\n                    <!-- <div class=\"message\" ng-bind-html=\"message.content.info\">\n                    </div> -->\n                    <chat-msg content=\"message.content\">\n                    </chat-msg>\n                    <!-- <div class=\"message-detail\">\n                        <span class=\"bold\">{{user.name}}</span>,\n                        <span></span>\n                    </div> -->\n                </div>\n            </div>\n            <div ng-if=\"message.content.contentType != \'borrow_history\' && user._id === message.sender\">\n                <img class=\"profile-pic right\" src=\"../img/user1.jpg\" />\n                <div class=\"chat-bubble right\">\n                    <chat-msg content=\"message.content\">\n                    </chat-msg>\n                    <!-- <div class=\"message-detail\">\n                        <span class=\"bold\">{{user.name}}</span>,\n                        <span></span>\n                    </div> -->\n                </div>\n            </div>\n            <div ng-if=\"message.content.contentType == \'borrow_history\'\">\n                <p class=\"borrow-history\">{{message | outputStatus:user }}</p>\n            </div>\n            <div class=\"cf\"></div>\n        </div>\n    </ion-content>\n    <form name=\"sendMessageForm\" ng-submit=\"sendMessage(sendMessageForm)\" novalidate>\n        <ion-footer-bar class=\"bar-stable item-input-inset message-footer\" keyboard-attach>\n            <label class=\"item-input-wrapper\">\n                <textarea class=\"chat-textarea\" ng-model=\"input.message\" value=\"\" placeholder=\"Send a message...\" required minlength=\"1\" maxlength=\"1500\" msd-elastic></textarea>\n            </label>\n            <div class=\"footer-btn-wrap\">\n                <button class=\"button button-icon icon ion-android-send footer-btn\" type=\"submit\" ng-disabled=\"!input.message || input.message === \'\'\">\n                </button>\n            </div>\n        </ion-footer-bar>\n    </form>\n</ion-view>\n");
$templateCache.put("config.html","<ion-view view-title=\"设置\" name=\"config-view\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n    </ion-nav-buttons>\n    <ion-content>\n        <div class=\"list\">\n            <a href=\"\" class=\"item item-icon-right\">\n                修改密码\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </a>\n            <div class=\"item item-divider\"></div>\n            <a href=\"\" class=\"item item-icon-right\">\n                给我们提意见\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </a>\n            <a href=\"\" class=\"item item-icon-right\">\n                关于邻书\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </a>\n            <div class=\"item item-divider\"></div>\n            <a href=\"\" class=\"item item-icon-right\" ng-click=\"logout()\">\n                退出登录\n                <i class=\"icon ion-ios-arrow-right\"></i>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("login.html","<ion-view view-title=\"登陆\" name=\"login-view\" animation=\"slide-left-right\">\n  <ion-content>\n      <div class=\"list\">\n          <label class=\"item item-input\">\n              <input type=\"text\" placeholder=\"用户名\" ng-model=\"data.username\">\n          </label>\n          <label class=\"item item-input\">\n              <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n          </label>\n      </div>\n      <div class=\"padding\">\n        <button class=\"button button-block button-calm\" ng-click=\"login()\">登陆</button>\n      </div>\n      <div class=\"padding\">\n        <a class=\"button button-block\" ui-sref=\"signin\">去注册</a>\n      </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("modal-location-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddLocationModal()\"></a>\n        <h1 class=\"title\">添加地址</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"输入地址\" name=\"name\" ng-model=\"location.name\" ng-change=\"inputChange()\">\n        </label>\n        <ul id=\"tipResult\" class=\"list\" ng-show=\"tipResult.length > 0\">\n            <li ng-repeat=\"tip in tipResult\" class=\"item\" ng-click=\"selectLocation(tip)\">{{tip.name}} <em class=\"item-note\">{{tip.district}}</em></li>\n        </ul>\n        <div id=\"mapContainer\" class=\"item\">\n            \n        </div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitLocation()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-map.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeMapModal()\"></a>\n        <h1 class=\"title\">地图</h1>\n    </ion-header-bar>\n    <ion-content>\n        \n        <div id=\"mapContainer\" class=\"item full-map\">\n            \n        </div>\n        \n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-slider.html","<div class=\"modal image-modal transparent\" ng-click=\"closeSlideModal()\">\n    <ion-slide-box>\n        <ion-slide ng-repeat=\"oImage in book.bookImgs\">\n            <img ng-src=\"{{oImage|addserverhost}}\" class=\"fullscreen-image\" />\n        </ion-slide>\n    </ion-slide-box>\n</div>\n");
$templateCache.put("schedule-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddScheduleModal()\"></a>\n        <h1 class=\"title\">添加行程</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-input item-stacked-label\">\n            <span class=\"input-label\">行程介绍:</span>\n            <textarea row=\"3\" ng-model=\"schedule.desc\" class=\"schedule-desc\"></textarea> \n        </label>\n        <label class=\"item item-input\">\n            <span class=\"input-label\">开始时间:</span>\n            <input type=\"datetime-local\" ng-model=\"schedule.starttime\">\n        </label>\n        <label class=\"item item-input\">\n            <span class=\"input-label\">结束时间:</span>\n            <input type=\"datetime-local\" ng-model=\"schedule.endtime\" >\n        </label>\n        <div class=\"item item-icon-left item-icon-right\" ng-click=\"triggeLocationShow()\">\n            <i class=\"icon ion-ios-navigate-outline\"></i>\n            <span class=\"input-label\">行程地点:{{location.name}}</span>\n            <i class=\"icon ion-ios-arrow-down\"></i>\n        </div>\n        <ul class=\"user-location list\" ng-show=\"showLocation\">\n            <li class=\"item\" ng-repeat=\"ul in usrLocations track by $index\" ng-click=\"selectSuggestLocation($index)\">{{ul.name}}</li>\n            <li class=\"item\" ng-click=\"openAddLocationModal()\">添加新地址</li>\n        </ul>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"addSchedule()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("schedule-detail.html","<ion-view view-title=\"行程\">\n    <ion-nav-buttons side=\"left\">\n         <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n        <div class=\"card\">\n            <div class=\"item item-avatar\">\n                <img ng-src=\"{{schedule._user.avatar | addserverhost}}\">\n                <h2>{{schedule._user.name}}</h2>\n            </div>\n            <label class=\"item item-input item-stacked-label\">\n                <span class=\"input-label\">行程介绍:</span> {{schedule.desc}}\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">开始时间:</span> {{schedule.starttime | date:\'m月d日 H点m分\'}}\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">结束时间:</span> {{schedule.endtime | date:\'m月d日 H点m分\'}}\n            </label>\n        </div>\n        <div class=\"hr\">\n            <span>行程地址</span>\n        </div>\n        <p class=\"tac\">{{schedule.locationName}}</h3>\n\n        <imgmap lnglat=\"schedule.lnglat\"></imgmap>\n\n        <div class=\"hr\">\n            <span><em ng-if=\"schedule._user.sex==1\">他</em><em ng-if=\"schedule._user.sex==0\">她</em>的书籍</span>\n        </div>\n        <div class=\"list\" ng-repeat=\"book in userBooks\">\n            <a class=\"item item-thumbnail-left\" nav-direction=\"forward\" ui-sref=\"bookdetail({id:book._id})\">\n                <img ng-src=\"{{book.bookImgs[0] | addserverhost}}\">\n                <h2>{{book.name}}</h2>\n                <p>{{book.desc}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("signin.html","<ion-view view-title=\"注册\" name=\"signin-view\">\n    <ion-content>\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <input type=\"text\" placeholder=\"用户名\" ng-model=\"data.name\">\n            </label>\n<!--             <label class=\"item item-input\">\n                <input type=\"tel\" placeholder=\"手机号\" ng-model=\"data.phone\">\n            </label> -->\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"再次输入您的密码\" ng-model=\"data.password2\">\n            </label>\n            <label class=\"item assertive\" ng-show=\"err\">\n              {{err}}\n            </label>\n        </div>\n        <div class=\"padding\">\n          <button class=\"button button-block button-calm\" ng-disabled=\"!data.name || err\" ng-click=\"signin()\">注册</button>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-account.html","<ion-view view-title=\"我\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\" ng-if=\"!isConfig\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n        <a class=\"button button-icon icon ion-ios-gear-outline\" nav-direction=\"forward\" ui-sref=\"config\" ng-if=\"isConfig\"></a>\n    </ion-nav-buttons>\n    <ion-content class=\"has-header\">\n        <!-- <a href=\"#login\" class=\"button button-block button-calm\">登陆</a>\n    <a href=\"#signin\" class=\"button button-block button-balanced\">注册</a> -->\n        <div class=\"profile\">\n            <div class=\"base-info\">\n                <a class=\"avatar\" ng-if=\"userInfo.avatar\" ui-sref=\"userinfo({action:\'update\'})\" nav-direction=\"forward\">\n                    <!--                     <div ng-if=\"userInfo.sex != \'\'\">\n                        <span ng-class=\"userInfo.sex==1 ? ion-male : ion-female\"></span>\n                    </div> -->\n                    <img ng-src=\"{{userInfo.avatar | addserverhost}}\" alt=\"\" class=\"avatar-img\" >\n                </a>\n                <a ng-if=\"!userInfo.avatar\" class=\"avatar\" ui-sref=\"userinfo({action:\'update\'})\" nav-direction=\"forward\">\n                    <span class=\"avatar-img icon icon ion-ios-person-outline\"></span>\n                </a>\n                <h4 class=\"user-name\">{{userInfo.name}}</h4>\n                <div class=\"signature\">{{userInfo.signature}}</div>\n            </div>\n            <div class=\"book-info\"></div>\n        </div>\n        <div class=\"hr\">\n            <span>我的书籍</span>\n        </div>\n        <div class=\"list\" ng-repeat=\"book in userBooks\">\n            <a class=\"item item-thumbnail-left\" nav-direction=\"forward\" ui-sref=\"bookdetail({id:book._id})\">\n                <img ng-src=\"{{book.bookImgs[0] | addserverhost}}\">\n                <h2>{{book.name}}</h2>\n                <p>{{book.desc}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-booklist.html","<ion-view view-title=\"附近\" align-title=\"center\">\n    <!--     <ion-nav-buttons side=\"primary\">\n        <a class=\"button button-icon icon ion-map\"></a>\n    </ion-nav-buttons>\n -->\n    <ion-nav-buttons side=\"secondary\">\n        <a class=\"button button-icon icon ion-plus-round\" ng-click=\"toggleAddActionList($event)\"></a>\n    </ion-nav-buttons>\n    <div class=\"action-select-wrapper\" ng-show=\"showAddActionList\" ng-click=\"toggleAddActionList($event)\">\n        <div class=\"list add-action-list has-header\">\n            <a class=\"item item-icon-left\" ng-click=\"openAddBookModal()\">\n                <i class=\"icon ion-ios-book\"></i> 添加图书\n            </a>\n            <a class=\"item item-icon-left\" ng-click=\"openAddScheduleModal()\">\n                <i class=\"icon ion-ios-calendar\"></i> 添加行程\n            </a>\n        </div>\n    </div>\n    <ion-content>\n        <div class=\"list card\" ng-repeat=\"book in booklist\">\n            <a class=\"item item-avatar\" nav-direction=\"forward\" ui-sref=\"useraccount({id:book._user._id})\">\n                <img ng-src=\"{{book._user.avatar | addserverhost}}\" alt=\"\">\n                <h2>{{book._user.name}}</h2>\n                <strong ng-if=\"book.starttime\">#行程#</strong>\n            </a>\n            <a class=\"item item-thumbnail-left\" nav-direction=\"forward\" ui-sref=\"bookdetail({id:book._id})\" ng-if=\"book.addDate\">\n                <img ng-src=\"{{book.bookImgs[0] | addserverhost}}\">\n                <h2>{{book.name}}</h2>\n                <p>{{book.desc}}</p>\n            </a>\n            <a ng-if=\"book.starttime\" class=\"item\" nav-direction=\"forward\" ui-sref=\"schedule({id:book._id,userId:book._user._id})\">\n                <strong>{{book.starttime | date:\'M月d日\'}}</strong> 我在\n                <strong>{{book.locationName}}</strong>\n                <p>快来和我交换图书吧</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-collections.html","<ion-view view-title=\"精选\">\n    <ion-content class=\"has-header\">\n\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-messages.html","<ion-view view-title=\"我的消息\">\n    <ion-content class=\"has-header\">\n        <div class=\"list\">\n            <a class=\"item item-avatar\" nav-direction=\"forward\" ui-sref=\"chat({sender:msg[0].sender.id,name:msg[0].sender.name})\" ng-repeat=\"msg in msgList | groupBy:\'sender.name\'\">\n                <img src=\"img/user1.jpg\">\n                <h2>{{msg[0].sender.name}}</h2>\n                <p>{{msg[0] | msgOutput | outputStatus}}</p>\n                <p>{{msg[0].date | date:\'MM-dd HH:mm\'}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tabs.html","<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"tabs-icon-top tabs-color-active-positive\">\n    <!-- Collections Tab -->\n    <ion-tab title=\"精选\" icon-off=\"ion-ios-star-outline\" icon-on=\"ion-ios-star\" href=\"#/tab/collections\">\n        <ion-nav-view name=\"tab-collections\"></ion-nav-view>\n    </ion-tab>\n    <!-- Booklist Tab -->\n    <ion-tab title=\"附近\" icon-off=\"ion-ios-bookmarks-outline\" icon-on=\"ion-ios-bookmarks\" href=\"#/tab/booklist\">\n        <ion-nav-view name=\"tab-booklist\"></ion-nav-view>\n    </ion-tab>\n    <!-- Chats Tab -->\n    <ion-tab title=\"消息\" icon-off=\"ion-ios-chatboxes-outline\" icon-on=\"ion-ios-chatboxes\" href=\"#/tab/messages\">\n        <ion-nav-view name=\"tab-messages\"></ion-nav-view>\n    </ion-tab>\n    <!-- Account Tab -->\n    <ion-tab title=\"我\" icon-off=\"ion-ios-person-outline\" icon-on=\"ion-ios-person\" href=\"#/tab/account\">\n        <ion-nav-view name=\"tab-account\"></ion-nav-view>\n    </ion-tab>\n</ion-tabs>\n");
$templateCache.put("userinfo.html","<ion-view view-title=\"用户信息\" name=\"signin-userinfo-view\">\n    <ion-content>\n        <div class=\"user-avatar-add\">\n            <label class=\"item-img-add\">\n                <span class=\"img-add-block\">\n                    <ion-spinner ng-show=\"loading\"></ion-spinner>\n                    <img ng-src=\"{{avatarUrl | addserverhost}}\" class=\"prev-img user-avatar-img\" ng-show=\"avatarUrl\">\n                    <em class=\"icon ion-ios-person-outline img-add-icon\"></em>\n                        <div class=\"img-input-wrap\">\n                        <form action={{addUserImgAction}} enctype=\"multipart/form-data\" class=\"img-add-input\">\n                            <input type=\"file\" accept=\"image/x-png, image/gif, image/jpeg\" class=\"img-add-input\" onchange=\"angular.element(this).scope().fileChange(this)\">\n                        </form>\n                    </div>\n                </span>\n            </label>\n        </div>\n        <div class=\"list\">\n            <label class=\"item item-input item-select\">\n                <div class=\"input-label\">\n                    性别\n                </div>\n                <select ng-model=\"userInfo.sex\" name=\"sexSelect\">\n                    <option value=\"1\">男</option>\n                    <option value=\"0\">女</option>\n                </select>\n            </label>\n            <label class=\"item item-input\">\n                <span class=\"input-label\">个人签名</span>\n                <textarea type=\"text\" ng-model=\"userInfo.signature\"></textarea>\n            </label>\n        </div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-calm\" ng-disabled=\"\" ng-click=\"updateUserInfo()\">完成</button>\n        </div>\n    </ion-content>\n</ion-view>\n");}]);