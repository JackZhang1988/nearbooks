angular.module('starter.services', [])
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
    .factory('Chats', function() {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function() {
                return chats;
            },
            remove: function(chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function(chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    });
