'use strict';

app
    //.run(function ($ocLazyLoad) {
    //    // 加载基础模块
    //    $ocLazyLoad.load('base');
    //})
    .run(
    function ($rootScope, $state, $stateParams, $localStorage, $http) {
        $http.defaults.headers.common['Authorization'] = $localStorage.auth;
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeSuccess', function (event, to, toParams, from, fromParams) {
            $rootScope.previousState = from;
            $rootScope.previousStateParams = fromParams;
        });
        $rootScope.back = function () {//实现返回的函数
            $state.go($rootScope.previousState.name, $rootScope.previousStateParams);
        };
    }
)
    .config(
    function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider
            .otherwise('/access/loading');
        $stateProvider
            .state('access', {
                abstract: true,
                url: '/access',
                template: '<div ui-view class="fade-in"></div>',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/access/ctrl.js');
                        }]
                }
            })
            .state('access.loading', {
                url: '/loading',
                templateUrl: 'admin/access/loading.html',
            })
            .state('access.signin', {
                url: '/signin',
                templateUrl: 'admin/access/signin.html',
            })
            .state('access.signup', {
                url: '/signup',
                templateUrl: 'admin/access/signup.html'
            })

            .state('app', {
                abstract: true,
                //url: '/app',
                templateUrl: 'admin/app.html',
            })
            .state('app.projects', {
                //abstract: true,
                url: '/projects',
                templateUrl: 'admin/projects/list.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/projects/ctrl.js');
                        }]
                }
            })
            .state('app.project', {
                //abstract: true,
                url: '/project',
                template: '<div ui-view class="fade-in"></div>',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/projects/ctrl.js');
                        }]
                }
            })
            .state('app.project.index', {
                //abstract: true,
                url: '/{projectid}',
                templateUrl: 'admin/projects/index.html',
            })
            .state('app.project.index.module', {
                //abstract: true,
                url: '/{moduleid}',
                templateUrl: 'admin/projects/index.html',
            })
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: 'admin/dashboard/dashboard.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/dashboard/ctrl.js');
                        }]
                },
                ncyBreadcrumb: {
                    label: '<i class="fa fa-home"></i> {{"工作台" | translate}}'
                }
            })

            // 报价
            .state('app.price', {
                url: '/price',
                templateUrl: 'admin/price/price.html',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/price/ctrl.js');
                        }]
                },
                ncyBreadcrumb: {
                    parent: 'app.dashboard',
                    label: '{{"报价" | translate}}',
                }
            })
            // 课程管理
            .state('app.kechengs', {
                abstract: true,
                url: '/kechengs',
                template: '<div ui-view class="fade-in"></div>',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function ($ocLazyLoad) {
                            return $ocLazyLoad.load('admin/kechengs/ctrl.js');
                        }]
                }
            })
            .state('app.kechengs.list', {
                url: '/list?page&search',
                templateUrl: 'admin/kechengs/list.html',
                ncyBreadcrumb: {
                    parent: 'app.dashboard',
                    label: '{{"课程管理" | translate}}',
                }
            })
    }
);
