angular.module('starter.directive', [])
    .directive('chatMsg', function($compile) {
        var bookTpl = '<div class="book"><a ui-sref="borrowhistory({id:content.info.borrowId})">我想借《{{content.info.bookName}}》</a></div>';
        var textTpl = '<div class="message" >{{content.info}}</div>';

        function getTemplate(contentType) {
            var template = '';
            switch (contentType) {
                case 'book':
                    template = bookTpl;
                    break;
                case 'text':
                    template = textTpl;
                    break;
                default:
                    template = '';
                    break;
            }
            return template;
        }
        return {
            restrict: 'E',
            scope: {
                content: '='
            },
            link: function(scope, element, attrs) {
            	element.html(getTemplate(scope.content.contentType));
            	$compile(element.contents())(scope);
            }
        }
    })
    .directive('borrowAction', function($compile){
        function getActionTpl(status,curUser){
            switch(status){
                case 'ASK_BORROW':
                    // if(curUser == )
                    return '<button class="button" ng-click="refuse()">拒绝</button><button class="button button-balanced" ng-click="agress()">同意</button>'
                case 'REFUSE_BORROW':
                    return '';
                case 'BORROWING':
                    return '<button class="button button-calm">结束申请</button>'
            }
        }
        return {
            restrict: 'EA',
            scope:{
                history:'=',
                curUser:'='
            },
            transclude:true,
            link: function(scope, element, attrs){
            }
        }
    })
