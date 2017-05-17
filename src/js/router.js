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
            /*
             路由规则

             #/loading
             #/signin
             #/signup
             #/projects
             #/project/{projectid}
             #/project/{projectid}/{pageid}
             */
            $urlRouterProvider
                .otherwise('/loading');
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
                    url: '^/loading',
                    templateUrl: 'admin/access/loading.html',
                })
                .state('access.signin', {
                    url: '^/signin?email&url',
                    templateUrl: 'admin/access/signin.html',
                })
                .state('access.signup', {
                    url: '^/signup?email&url',
                    templateUrl: 'admin/access/signup.html'
                })
                .state('access.invite', {
                    url: '^/invite?code&email&t',
                    templateUrl: 'admin/access/invite.html'
                })

                .state('app', {
                    abstract: true,
                    //url: '/app',
                    templateUrl: 'admin/app.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/page/filter.js');
                            }]
                    }
                })
                // projects
                .state('app.projects', {
                    //abstract: true,
                    url: '/projects',
                    templateUrl: 'admin/projects/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/projects/ctrl.js');
                            }]
                    }
                })


                .state('app.pages', {
                    //abstract: true,
                    url: '/pages',
                    templateUrl: 'admin/page/list.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/page/ctrl.js');
                            }]
                    }
                })
                .state('app.page', {
                    //abstract: true,
                    url: '/page',
                    template: '<div ui-view class="fade-in"></div>',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'admin/page/ctrl.js',
                                    'admin/page/design.js',
                                    'admin/page/filter.js',
                                    'admin/page/datatable/datatable.js',
                                    'admin/page/datasource/datasource.js',
                                ]);
                            }]
                    }
                })


                // .state('app.project', {
                //     //abstract: true,
                //     url: '/project',
                //     template: '<div ui-view class="fade-in"></div>',
                //     resolve: {
                //         deps: ['$ocLazyLoad',
                //             function ($ocLazyLoad) {
                //                 return $ocLazyLoad.load('admin/projects/ctrl.js');
                //             }]
                //     }
                // })
                .state('app.project', {
                    //abstract: true,
                    url: '/{projectid}',
                    templateUrl: 'admin/project/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/project/ctrl.js');
                            }]
                    }
                })
                // .state('app.project.index.module', {
                //     //abstract: true,
                //     url: '/{moduleid}',
                //     templateUrl: 'admin/projects/index.html',
                // })
                .state('app.project.pages', {
                    //abstract: true,
                    url: '/pages',
                    templateUrl: 'admin/page/list.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/page/ctrl.js');
                            }]
                    }
                })
                .state('app.project.settings', {
                    //abstract: true,
                    url: '/settings',
                    templateUrl: 'admin/project/settings.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'admin/project/ctrl.js',
                                    'admin/connects/ctrl.js',
                                    'admin/page/ctrl.js'
                                ]);
                            }]
                    }
                })
                .state('app.project.quickbuild', {
                    //abstract: true,
                    url: '/quickbuild',
                    templateUrl: 'admin/quickbuild/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'admin/quickbuild/ctrl.js',
                                ]);
                            }]
                    }
                })
                .state('app.project.noconnects', {
                    //abstract: true,
                    url: '/noconnects',
                    templateUrl: 'admin/project/noconnects.html',
                })
                .state('app.project.nopages', {
                    //abstract: true,
                    url: '/nopages',
                    templateUrl: 'admin/project/nopages.html',
                })
                .state('app.project.page', {
                    //abstract: true,
                    url: '/{pageid}',
                    templateUrl: 'admin/page/page.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'admin/page/ctrl.js',
                                    'admin/page/design.css',
                                    'admin/page/design.js',
                                    'admin/page/datatable/datatable.js',
                                    'admin/page/datasource/datasource.js',
                                    'admin/page/components/list-group.js',
                                ]);
                            }]
                    }
                })

                .state('app.project.design', {
                    //abstract: true,
                    url: '/{pageid}/design',
                    templateUrl: 'admin/page/edit.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load([
                                    'admin/page/ctrl.js',
                                    'admin/page/design.js',
                                    'admin/page/design.css',
                                    'admin/page/filter.js',
                                    'admin/page/datatable/datatable.js',
                                    'admin/page/datasource/datasource.js',
                                    'admin/page/components/list-group.js',
                                ]);
                            }]
                    }
                })

                .state('app.project.connects', {
                    //abstract: true,
                    url: '/connects',
                    templateUrl: 'admin/connects/index.html',
                    resolve: {
                        deps: ['$ocLazyLoad',
                            function ($ocLazyLoad) {
                                return $ocLazyLoad.load('admin/connects/ctrl.js');
                            }]
                    }
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
        }
    );
