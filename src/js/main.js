'use strict';

/* Controllers */

angular.module('app')
    .controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$state', '$http', '$resource','ngProgressFactory',
        function ($scope, $translate, $localStorage, $window, $state, $http, $resource,ngProgressFactory) {
            // add 'ie' classes to html
            var isIE = !!navigator.userAgent.match(/MSIE/i);
            isIE && angular.element($window.document.body).addClass('ie');
            isSmartDevice($window) && angular.element($window.document.body).addClass('smart');

            // config
            //app.host = "http://api.admin.htmlid.cn/api" ;// "http://localhost:3595/api";// "http://adminapi.yys.ren:8011/api";// "http://localhost:65030/api"; //"http://adminapi.yys.ren/api";
            app.host = "http://localhost:3595/api" ;// "http://localhost:3595/api";// "http://adminapi.yys.ren:8011/api";// "http://localhost:65030/api"; //"http://adminapi.yys.ren/api";
            app.debug = true;
            $scope.app = {
                host: app.host,
                debug:app.debug,
                name: 'Easy Admin',
                version: '1.0.0',
                // for chart colors
                color: {
                    primary: '#7266ba',
                    info: '#23b7e5',
                    success: '#27c24c',
                    warning: '#fad733',
                    danger: '#f05050',
                    light: '#e8eff0',
                    dark: '#3a3f51',
                    black: '#1c2b36'
                },
                settings: {
                    themeID: 1,
                    navbarHeaderColor: 'bg-black',
                    navbarCollapseColor: 'bg-white-only',
                    asideColor: 'bg-black',
                    headerFixed: true,
                    asideFixed: true,
                    asideFolded: false,
                    asideDock: false,
                    container: false
                }
            };

                   // save settings to local storage
            if (angular.isDefined($localStorage.settings)) {
                $scope.app.settings = $localStorage.settings;
            } else {
                $localStorage.settings = $scope.app.settings;
            }
            $scope.$watch('app.settings', function () {
                if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
                    // aside dock and fixed must set the header fixed.
                    $scope.app.settings.headerFixed = true;
                }
                // save to local storage
                $localStorage.settings = $scope.app.settings;
            }, true);

            // angular translate
            $scope.lang = {isopen: false};
            $scope.langs = {en: 'English', zh: '中文'};
            $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
            $scope.setLang = function (langKey, $event) {
                // set the current lang
                $scope.selectLang = $scope.langs[langKey];
                // You can change the language during runtime
                $translate.use(langKey);
                $scope.lang.isopen = !$scope.lang.isopen;
            };

            // progress
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.$on('$stateChangeStart', function(event) {
                $scope.progressbar.setColor('#23b7e5')
                $scope.progressbar.start();
            });
            $scope.$on('$stateChangeSuccess', function( event, toState, toParams, fromState ) {
                event.targetScope.$watch('$viewContentLoaded', function(){
                    $scope.progressbar.complete();
                    //el.addClass('hide').removeClass('active');
                })
            });



            $scope.getsession_user= function(){
                return $localStorage.user;
            }
            $scope.session_user = $localStorage.user;

            // 退出登录
            $scope.logout = function () {
                $scope.session_user = $localStorage.user = $localStorage.auth = null;
                $http.defaults.headers.common['Authorization'] = "";
                $state.go("access.signin");
            }
            function isSmartDevice($window) {
                // Adapted from http://www.detectmobilebrowsers.com
                var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
                // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
                return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
            }

        }
    ]);