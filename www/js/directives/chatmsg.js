angular.module('starter.directive')
    .directive('chatMsg', function($compile) {
        var bookTpl = '<div class="book"><a nav-direction="forward" ui-sref="borrowhistory({id:content.info.borrowId})">我想借《{{content.info.bookName}}》</a></div>';
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
