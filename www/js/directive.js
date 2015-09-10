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
        function getActionTpl(scope){
            switch(scope.bHis.status){
                case 'ASK_BORROW':
                    if(scope.curUser._id == scope.bHis.owner){
                        return '<button class="button" ng-click="refuseApply()">拒绝</button><button class="button button-balanced" ng-click="agressApply()">同意</button>'
                    }else if(scope.curUser._id == bHis.borrower){
                        return '<button class="button button-balanced" ng-click="cancelApply()">取消申请</button>'
                    }
                case 'REFUSE_BORROW':
                    return '';
                case 'BORROWING':
                    if(scope.curUser._id == scope.bHis.owner){
                        return '<button class="button button-calm">取消申请</button>'
                    }
                default:
                    return '';
            }
        }
        return {
            restrict: 'A',
            scope:true,
            transclude:true,
            link: function($scope, element, attrs){
                $scope.$watch('bHis',function(){
                    element.html(getActionTpl($scope));
                    $compile(element.contents())($scope);
                })
            }
        }
    })
