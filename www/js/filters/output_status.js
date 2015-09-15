angular.module('starter.filter')
    .filter('outputStatus', function(UserService) {
        return function(msg) {
            if (msg.content && msg.content.contentType == 'borrow_history') {
                var user = UserService.getUser();
                var prefixStr = '';
                if (user._id == msg.sender) {
                    prefixStr = '对方';
                } else {
                    prefixStr = '你';
                }
                switch (msg.content.info.status) {
                    case 'ASK_BORROW':
                        return prefixStr + '提交了一条借书申请';
                    case 'REFUSE_BORROW':
                        return prefixStr + '拒绝了申请';
                    case 'CANCEL_BORROW':
                        return prefixStr + '取消了申请';
                    case 'BORROWED':
                        return prefixStr + '同意了申请';
                    default:
                        return '';
                }
            } else {
                return msg;
            }
        }
    })
