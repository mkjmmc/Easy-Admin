// config

var app =
    angular.module('app')
        .config(
        ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

                // lazy controller, directive and service
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ])
        .config(['$translateProvider', function ($translateProvider) {
            // Register a loader for the static files
            // So, the module will search missing translation tables under the specified urls.
            // Those urls are [prefix][langKey][suffix].
            $translateProvider.useStaticFilesLoader({
                prefix: 'l10n/',
                suffix: '.json'
            });
            // Tell the module what language to use by default
            $translateProvider.preferredLanguage('zh');
            // Tell the module to store the language in the local storage
            //$translateProvider.use('zh');
            $translateProvider.useLocalStorage();

            $translateProvider.useSanitizeValueStrategy('escape');
        }])

        .run(['$templateCache', function ($templateCache) {
            //$templateCache.put('/dialogs/confirm.html','<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> User\'s Name</h4></div><div class="modal-body"><ng-form name="nameDialog" novalidate role="form"><div class="form-group input-group-lg" ng-class="{true: \'has-error\'}[nameDialog.username.$dirty && nameDialog.username.$invalid]"><label class="control-label" for="course">Name:</label><input type="text" class="form-control" name="username" id="username" ng-model="user.name" ng-keyup="hitEnter($event)" required><span class="help-block">Enter your full name, first &amp; last.</span></div></ng-form></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="cancel()">Cancel</button><button type="button" class="btn btn-primary" ng-click="save()" ng-disabled="(nameDialog.$dirty && nameDialog.$invalid) || nameDialog.$pristine">Save</button></div>');
            // $templateCache.put('/dialogs/confirm.html','<div class="modal-header dialog-header-confirm"><button type="button" class="close" ng-click="no()">&times;</button><h4 class="modal-title"><span class="'+startSym+'icon'+endSym+'"></span> '+startSym+'header'+endSym+'</h4></div><div class="modal-body" ng-bind-html="msg"></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="yes()">确定</button><button type="button" class="btn btn-primary" ng-click="no()">取消</button></div>');

            //$templateCache.put('/dialogs/custom2.html','<div class="modal-header"><h4 class="modal-title"><span class="glyphicon glyphicon-star"></span> Custom Dialog 2</h4></div><div class="modal-body"><label class="control-label" for="customValue">Custom Value:</label><input type="text" class="form-control" id="customValue" ng-model="data.val" ng-keyup="hitEnter($event)"><span class="help-block">Using "dialogsProvider.useCopy(false)" in your applications config function will allow data passed to a custom dialog to retain its two-way binding with the scope of the calling controller.</span></div><div class="modal-footer"><button type="button" class="btn btn-default" ng-click="done()">Done</button></div>')
        }])
        .run(function(){
            $.fn.select2.defaults.set( "theme", "bootstrap" );
        })
        .value('cgBusyDefaults', {
            message: 'Loading',
            backdrop: true,
            templateUrl: 'vendor/angular/angular-busy/angular-busy.html',
            delay: 300,
            //minDuration: 700,
            //wrapperClass: 'my-class my-class2'
        });
//app.config(function ($breadcrumbProvider) {
//    $breadcrumbProvider.setOptions({
//        templateUrl: 'tpl/blocks/breadcrumb.html',
//        translations: true
//    });
//});

//app.config(['$httpProvider', function ($httpProvider) {
//    $httpProvider.interceptors.push(HttpInterceptor);
//}]);
//app.factory('HttpInterceptor', ['$q', '$timeout', HttpInterceptor]);
//function HttpInterceptor($q, $timeout) {
//    toastr.options = {
//        "closeButton": false,
//        "debug": false,
//        "newestOnTop": false,
//        "progressBar": true,
//        "positionClass": "toast-top-right",
//        "preventDuplicates": false,
//        "onclick": null,
//        "showDuration": "300",
//        "hideDuration": "1000",
//        "timeOut": "8000",
//        "extendedTimeOut": "1000",
//        "showEasing": "swing",
//        "hideEasing": "linear",
//        "showMethod": "fadeIn",
//        "hideMethod": "fadeOut"
//    };
//    var defered = $q.defer();
//    return {
//        request: function (config) {
//            //NProgress.start();
//            return config;
//        },
//        requestError: function (err) {
//            toastr["error"]("请检查您的网络连接情况", "请求发送失败");
//            //NProgress.start();
//            return $q.reject(err);
//        },
//        response: function (res) {
//            //NProgress.done();
//            // toastr["success"]("获取列表成功", "完成");
//            return $q.resolve(res);
//        },
//        responseError: function (err) {
//            //NProgress.done();
//            if (-1 === err.status) {
//                toastr["error"]("远程服务器无响应");
//            } else if (404 === err.status) {
//                toastr["error"]("找不到资源");
//            } else {
//                toastr["error"]("发生错误，代码：" + err.status, "失败");
//            }
//            return $q.reject(err);
//        }
//    };
//}