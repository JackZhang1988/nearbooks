angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("book-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddBookModal()\"></a>\n        <h1 class=\"title\">添加图书</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-img-add\">\n            <ul ng-show=\"prevImgList.length\" class=\"img-prev\">\n                <li class=\"prev-item\" ng-repeat=\"imgUrl in prevImgList\" >\n                    <img ng-src=\"{{imgUrl | addserverhost}}\" class=\"prev-img\">\n                </li>\n            </ul>\n            <ion-spinner ng-show=\"bookInfo.loading\"></ion-spinner>\n            <span class=\"img-add-block\" ng-show=\"!bookInfo.loading && prevImgList.length <= 3\">\n                <em class=\"icon ion-ios-plus-empty img-add-icon\"></em>\n                <div class=\"img-input-wrap\">\n                <form action={{addNewBookAction}} enctype=\"multipart/form-data\" class=\"img-add-input\">\n                    <input type=\"file\" accept=\"image/x-png, image/gif, image/jpeg\" class=\"img-add-input\" onchange=\"angular.element(this).scope().fileChange(this)\">\n                </form>\n                </div>\n            </span>\n        </label>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"书名\" name=\"name\" ng-model=\"bookInfo.bookName\" ng-change=\"getDoubanInfo()\">\n        </label>\n        <ul class=\"list\" ng-show=\"doubanSuggestShow\">\n            <li class=\"item\" ng-repeat=\"book in doubanSuggestBooks\" ng-click=\"doubanBookSelected($index)\">\n                <h2>{{book.title}}</h2>\n                <p>作者:{{book.author[0]}},价格:{{book.price}},<strong>评分:{{book.rating.average}}</strong></p>\n            </li>\n        </ul>\n        <label class=\"item item-input\">\n            <textarea name=\"\" rows=\"3\" placeholder=\"描述\" name=\"desc\" ng-model=\"bookInfo.bookDesc\"></textarea>\n        </label>\n        <label class=\"item\">\n            <span>豆瓣评分</span>\n            <span class=\"badge badge-energized\">{{bookInfo.doubanRating}}</span>\n        </label>\n        <div class=\"item\" ng-click=\"triggeLocationShow()\">\n            <span class=\"input-label\">地点:{{location.name}}</span>\n        </div>\n        <ul class=\"user-location list\" ng-show=\"showLocation\">\n            <li class=\"item\" ng-repeat=\"ul in usrLocations track by $index\" ng-click=\"selectSuggestLocation($index)\">{{ul.name}}</li>\n            <li class=\"item\" ng-click=\"openAddLocationModal()\">添加新地址</li>\n        </ul>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitNew()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("book-detail.html","<ion-view view-title=\"{{book.name}}\" name=\"book-detail\" animation=\"slide-left-right\">\n    <ion-nav-buttons side=\"primary\">\n        <button ng-click=\"goBack()\" class=\"button back-button buttons button-clear header-item\">\n            <i class=\"icon ion-ios-arrow-back\"></i>\n        </button>\n    </ion-nav-buttons>\n    <ion-content>\n        <ion-slide-box>\n            <ion-slide ng-repeat=\"img in book.bookImgs\" does-continue=\"true\">\n                <div class=\"img-slider-wrap\" style=\"background:url({{img|addserverhost}}) no-repeat;background-size:cover;\" ng-click=\"showSlideModal($index)\">\n                    <div class=\"img-slider-mask\">\n                    </div>\n                </div>\n            </ion-slide>\n        </ion-slide-box>\n        <div class=\"book-info\">\n            <h3 class=\"title\">{{book.name}}</h3>\n            <div class=\"book-user-info\">\n                <img src=\"../img/user1.jpg\" alt=\"\" class=\"avatar\">\n                <div>{{user.name}}</div>\n            </div>\n            <div class=\"book-desc\">{{book.desc}}</div>\n            <div class=\"card douban-info\">\n                <div class=\"item item-text-wrap\" ng-click=\"summaryShow=!summaryShow\">\n                    <span>豆瓣评分：</span>\n                    <span class=\"badge badge-assertive rating\">{{book.doubanInfo.rating}}</span>\n                    <span class=\"ion accordion-icon\" ng-class=\"{\'ion-ios-arrow-up\':summaryShow,\'ion-ios-arrow-down\':!summaryShow}\"></span>\n                </div>\n                <p class=\"item item-text-wrap\" ng-show=\"summaryShow\">内容简介：{{book.doubanInfo.summary}}</p>\n            </div>\n            <div class=\"hr\">\n                <span>取物地址</span>   \n            </div>\n            <img ng-src=\"{{book.locationImg}}\" alt=\"\" class=\"book-location-img\" ng-click=\"showMapModal()\">\n        </div>\n    </ion-content>\n    <ion-footer-bar class=\"bar\" ng-show=\"curUser._id != user._id\">\n        <button class=\"button button-balanced button-large pull-right\" id=\"borrowBtn\" ng-click=\"borrow()\">我想借</button>\n    </ion-footer-bar>\n</ion-view>\n");
$templateCache.put("chat-detail.html","<ion-view  id=\"userMessagesView\" cache-view=\"false\" view-title=\"<i class=\'icon ion-chatbubble user-messages-top-icon\'></i> <div class=\'msg-header-username\'>{{user.name}}</div>\">\n    <div class=\"loader-center\" ng-if=\"!doneLoading\">\n        <div class=\"loader\">\n            <i class=\"icon ion-loading-c\"></i>\n        </div>\n    </div>\n    <ion-content has-bouncing=\"true\" class=\"has-header has-footer\" delegate-handle=\"userMessageScroll\">\n        <div ng-repeat=\"message in messages\" class=\"message-wrapper\">\n            <div ng-if=\"user._id !== message.sender\">\n                <img class=\"profile-pic left\" src=\"../img/user2.png\"/>\n                <div class=\"chat-bubble left\">\n                    <div class=\"message\" ng-bind-html=\"message.content[0].info\">\n                    </div>\n                    <!-- <div class=\"message-detail\">\n                        <span class=\"bold\">{{user.name}}</span>,\n                        <span></span>\n                    </div> -->\n                </div>\n            </div>\n            <div ng-if=\"user._id === message.sender\">\n                <img class=\"profile-pic right\" src=\"../img/user1.jpg\"/>\n                <div class=\"chat-bubble right\">\n                    <div class=\"message\" ng-bind-html=\"message.content[0].info\">\n                    </div>\n                    <!-- <div class=\"message-detail\">\n                        <span class=\"bold\">{{user.name}}</span>,\n                        <span></span>\n                    </div> -->\n                </div>\n            </div>\n            <div class=\"cf\"></div>\n        </div>\n    </ion-content>\n    <form name=\"sendMessageForm\" ng-submit=\"sendMessage(sendMessageForm)\" novalidate>\n        <ion-footer-bar class=\"bar-stable item-input-inset message-footer\" keyboard-attach>\n            <label class=\"item-input-wrapper\">\n                <textarea ng-model=\"input.message\" value=\"\" placeholder=\"Send a message...\" required minlength=\"1\" maxlength=\"1500\" msd-elastic></textarea>\n            </label>\n            <div class=\"footer-btn-wrap\">\n                <button class=\"button button-icon icon ion-android-send footer-btn\" type=\"submit\" ng-disabled=\"!input.message || input.message === \'\'\">\n                </button>\n            </div>\n        </ion-footer-bar>\n    </form>\n</ion-view>\n");
$templateCache.put("login.html","<ion-view view-title=\"登陆\" name=\"login-view\" animation=\"slide-left-right\">\n  <ion-content>\n      <div class=\"list\">\n          <label class=\"item item-input\">\n              <input type=\"text\" placeholder=\"用户名或手机号\" ng-model=\"data.username\">\n          </label>\n          <label class=\"item item-input\">\n              <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n          </label>\n      </div>\n      <div class=\"padding\">\n        <button class=\"button button-block button-calm\" ng-click=\"login()\">登陆</button>\n      </div>\n  </ion-content>\n</ion-view>");
$templateCache.put("modal-location-add.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeAddLocationModal()\"></a>\n        <h1 class=\"title\">添加地址</h1>\n    </ion-header-bar>\n    <ion-content>\n        <label class=\"item item-input\">\n            <input type=\"text\" placeholder=\"输入地址\" name=\"name\" ng-model=\"location.name\" ng-change=\"inputChange()\">\n        </label>\n        <ul id=\"tipResult\" class=\"list\" ng-show=\"tipResult.length > 0\">\n            <li ng-repeat=\"tip in tipResult\" class=\"item\" ng-click=\"selectLocation(tip)\">{{tip.name}} <em class=\"item-note\">{{tip.district}}</em></li>\n        </ul>\n        <div id=\"mapContainer\" class=\"item\">\n            \n        </div>\n        <div class=\"padding\">\n            <button class=\"button button-block button-positive\" ng-click=\"submitLocation()\">\n                提交\n            </button>\n        </div>\n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-map.html","<ion-modal-view>\n    <ion-header-bar class=\"bar-positive fix-buttons\">\n        <a class=\"button button-icon icon ion-close-round\" ng-click=\"closeMapModal()\"></a>\n        <h1 class=\"title\">地图</h1>\n    </ion-header-bar>\n    <ion-content>\n        \n        <div id=\"mapContainer\" class=\"item full-map\">\n            \n        </div>\n        \n    </ion-content>\n</ion-modal-view>\n");
$templateCache.put("modal-slider.html","<div class=\"modal image-modal transparent\" ng-click=\"closeSlideModal()\">\n    <ion-slide-box>\n        <ion-slide ng-repeat=\"oImage in book.bookImgs\">\n            <img ng-src=\"{{oImage|addserverhost}}\" class=\"fullscreen-image\" />\n        </ion-slide>\n    </ion-slide-box>\n</div>\n");
$templateCache.put("signin.html","<ion-view view-title=\"注册\" name=\"signin-view\">\n    <ion-content>\n        <div class=\"list\">\n            <label class=\"item item-input\">\n                <input type=\"text\" placeholder=\"用户名\" ng-model=\"data.name\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"tel\" placeholder=\"手机号\" ng-model=\"data.phone\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"密码\" ng-model=\"data.password\">\n            </label>\n            <label class=\"item item-input\">\n                <input type=\"password\" placeholder=\"再次输入您的密码\" ng-model=\"data.password2\">\n            </label>\n            <label class=\"item assertive\" ng-show=\"err\">\n              {{err}}\n            </label>\n        </div>\n        <div class=\"padding\">\n          <button class=\"button button-block button-calm padding\" ng-click=\"signin()\">登陆</button>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-account.html","<ion-view view-title=\"我\">\n  <ion-content class=\"has-header\">\n	<a href=\"#login\" class=\"button button-block button-calm\">登陆</a>\n	<a href=\"#signin\" class=\"button button-block button-balanced\">注册</a>\n  </ion-content>\n</ion-view>\n");
$templateCache.put("tab-booklist.html","<ion-view view-title=\"邻书\" align-title=\"center\">\n<!--     <ion-nav-buttons side=\"primary\">\n        <a class=\"button button-icon icon ion-map\"></a>\n    </ion-nav-buttons>\n -->    <ion-nav-buttons side=\"secondary\">\n        <a class=\"button button-icon icon ion-plus-round\" ng-click=\"openAddBookModal()\"></a>\n    </ion-nav-buttons>\n    <ion-content>\n        <div class=\"list card\" ng-repeat=\"book in booklist\">\n            <div class=\"item item-avatar\">\n                <img src=\"../img/user1.jpg\" alt=\"\">\n                <h2>{{book.name}}</h2>\n            </div>\n            <a class=\"item item-thumbnail-left\" ui-sref=\"bookdetail({id:book._id})\">\n                <img ng-src=\"{{book.bookImgs[0] | addserverhost}}\">\n                <h2>{{book.name}}</h2>\n                <p>{{book.desc}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tab-messages.html","<ion-view view-title=\"我的消息\">\n    <ion-content class=\"has-header\">\n        <div class=\"list\">\n            <a class=\"item item-avatar\" ui-sref=\"chat({sender:msg.sender.id})\" ng-repeat=\"msg in msgList\">\n                <img src=\"img/user1.jpg\">\n                <h2>{{msg.sender.name}}</h2>\n                <p>{{msg.output}}</p>\n                <p>{{msg.date | date:\'MM-dd HH:mm\'}}</p>\n            </a>\n        </div>\n    </ion-content>\n</ion-view>\n");
$templateCache.put("tabs.html","<!--\nCreate tabs with an icon and label, using the tabs-positive style.\nEach tab\'s child <ion-nav-view> directive will have its own\nnavigation history that also transitions its views in and out.\n-->\n<ion-tabs class=\"tabs-icon-top tabs-color-active-positive\">\n    <!-- Booklist Tab -->\n    <ion-tab title=\"附近\" icon-off=\"ion-ios-bookmarks-outline\" icon-on=\"ion-ios-bookmarks\" href=\"#/tab/booklist\">\n        <ion-nav-view name=\"tab-booklist\"></ion-nav-view>\n    </ion-tab>\n    <!-- Collections Tab -->\n    <ion-tab title=\"精选\" icon-off=\"ion-ios-star-outline\" icon-on=\"ion-ios-star\" href=\"#/tab/collections\">\n        <ion-nav-view name=\"tab-collections\"></ion-nav-view>\n    </ion-tab>\n    <!-- Chats Tab -->\n    <ion-tab title=\"消息\" icon-off=\"ion-ios-chatboxes-outline\" icon-on=\"ion-ios-chatboxes\" href=\"#/tab/messages\">\n        <ion-nav-view name=\"tab-messages\"></ion-nav-view>\n    </ion-tab>\n    <!-- Account Tab -->\n    <ion-tab title=\"我\" icon-off=\"ion-ios-person-outline\" icon-on=\"ion-ios-person\" href=\"#/tab/account\">\n        <ion-nav-view name=\"tab-account\"></ion-nav-view>\n    </ion-tab>\n</ion-tabs>\n");}]);