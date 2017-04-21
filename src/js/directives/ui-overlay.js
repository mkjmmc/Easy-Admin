angular.module('app')
    .directive('uiOverlay', ['$rootScope', '$anchorScroll', function ($rootScope, $anchorScroll) {
        return {
            restrict: 'EA',
            template: "<div class=\"ui-overlay-container\">\n    <div class=\"overlayBackground\"></div>\n    <div class=\"overlayContent\" data-ng-transclude></div>\n    <ng-transclude></ng-transclude>\n</div>",
            transclude: true,
            link: function (scope, element, attrs,fn) {

                var position = element.css('position');
                if (position === 'static' || position === '' || typeof position === 'undefined'){
                    element.css('position','relative');
                }

                el.addClass('butterbar hide');
                scope.$on('$stateChangeStart', function (event) {
                    $anchorScroll();
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    event.targetScope.$watch('$viewContentLoaded', function () {
                        el.addClass('hide').removeClass('active');
                    })
                });
            }
        };
    }]);