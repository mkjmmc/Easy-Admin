'use strict';
(function (angular) {
    'use strict';

    var module = angular.module('angular-bind-html-compile', []);

    module.directive('bindHtmlCompile', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                scope.$watch(function () {
                    return scope.$eval(attrs.bindHtmlCompile);
                }, function (value) {
                    // In case value is a TrustedValueHolderType, sometimes it
                    // needs to be explicitly called into a string in order to
                    // get the HTML string.
                    element.html(value && value.toString());
                    // If scope is provided use it, otherwise use parent scope
                    var compileScope = scope;
                    if (attrs.bindHtmlScope) {
                        compileScope = scope.$eval(attrs.bindHtmlScope);
                    }
                    $compile(element.contents())(compileScope);
                });
            }
        };
    } ]);
} (window.angular));

app.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});

app.filter('objFilter', function ($filter) {
    return function (items, toFilter) {
        var values = [];
        Object.keys(items).forEach(function (v) {
            values.push(items[v]);
        });
        return $filter('filter')(values, toFilter);
    };
});


app.filter('datetime', function ($filter) {
    return function (minsecond, format) {
        var date = new Date(minsecond - 8 * 60 * 60 * 1000);
        if (!format) {
            format = 'yyyy-MM-dd HH:mm:ss';
        }
        return $filter('date')(date, format);

    };
});

app.filter('enum', function ($filter) {
    return function (value, enums) {
        if (enums && enums.length > 0) {
            for (var k = 0; k < enums.length; k++) {
                if (enums[k].value == value) {
                    return enums[k].label;
                }
            }
        }
        return value;
    };
});


app.filter('getchild', function () {
    return function (incItems, filter, name) {
        var item = null;
        for (var i = 0; i < incItems.length; i++) {
            var result = true;
            for (var key in filter) {
                if (incItems[i][key] != filter[key]) {
                    result = false;
                }
            }
            if (result) {
                item = incItems[i];
                break;
            }
        }
        if (item && item[name]) {
            return item[name];
        }
        return [];
    };
});