// 加载
app.controller('ProjectDashboardController', function ($scope, $resource, $state, $stateParams, $localStorage, rest_projects, rest_modules, rest_pages, rest_connects, $uibModal) {

    $scope.projectid = $stateParams.projectid;
    $scope.pinpagelistbar = false;
    $scope.project = {};
    $scope.users = [];
    $scope.configs = {
        project_nav: {
            list: []
        }
    }
    // $scope.currentpage = null;

    $scope.getcurrentpage = function () {
        if ($stateParams.pageid && $stateParams.pageid > 0 && $scope.pages) {
            for (var i = 0; i < $scope.pages.length; i++) {
                if ($scope.pages[i].ID == $stateParams.pageid) {
                    return $scope.pages[i];
                }
            }
        }
        return null;
    };

    $scope.loadprojectinfo = function () {
        // 获取项目列表
        rest_projects
            .info($scope.projectid)
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        $scope.project = data.data;
                        if ($scope.project.Configs.length > 0) {
                            $scope.configs = JSON.parse($scope.project.Configs);
                        }
                        break;
                    default :
                        alert('项目不存在');
                        break;
                }
            }, function (resp) {
                console.log(resp);
                alert(resp);
            });
    };
    $scope.loadprojectinfo();

    // 获取所有的页面列表
    $scope.loadpages = function () {
        rest_pages
            .list({ProjectID: $scope.projectid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    // alert(data);
                    // 显示数据
                    $scope.pages = data.data;
                    if ($state.is('app.project')) {
                        if ($scope.pages.length == 0) {
                            $state.go('app.project.nopages')
                        }
                        console.log($stateParams.pageid)
                        if (!$stateParams.pageid && $scope.pages.length > 0) {
                            for (var i = 0; i < $scope.pages.length; i++) {
                                if ($scope.pages[i].IsPublic == 1) {
                                    $state.go('app.project.page', {projectid: $scope.projectid, pageid: $scope.pages[i].ID});
                                    break;
                                }
                            }
                        }
                    }

                }
                else {
                    alert(data.message);
                }
            });
    };
    // $scope.loadpages();

    // 获取项目所有成员
    $scope.loadusers = function () {
        rest_projects
            .users($scope.projectid)
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    // alert(data);
                    // 显示数据
                    $scope.users = data.data;
                }
                else {
                    alert(data.message);
                }
            });
    };
    $scope.loadusers();

    // 获取所有的数据库连接
    $scope.loadconnects = function () {
        rest_connects
            .list($scope.projectid)
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    // alert(data);
                    // 显示数据
                    $scope.connects = data.data;
                    if ($state.is('app.project')) {
                        if ($scope.connects.length == 0) {
                            $state.go('app.project.noconnects')
                        }
                    }
                }
                else {
                    alert(data.message);
                }
                $scope.loadpages();
            });
    };
    $scope.loadconnects();

    // 读取模块
    $scope.loadmodules = function () {
        // 获取项目列表
        rest_modules
            .list({projectid: $scope.projectid})
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        $scope.modules = data.data;
                        break;
                    default :
                        $state.go('access.loading');
                        break;
                }
            }, function () {
                $state.go('access.loading');
            });
    };
    $scope.loadmodules();

    $scope.showcreatedialog = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'sm',
            template: '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$ctrl.cancel()"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title"> 创建模块</h3>\n</div>\n<div class="modal-body">\n    <div class="form-group">\n        <label class="control-label">模块名称</label>\n        <input ng-model="name" class="form-control" >\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>\n    <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Cancel</button>\n</div>',
            controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, rest_projects, data) {
                //$scope.component = data.component;
                $scope.error = "";

                var $ctrl = this;
                $ctrl.ok = function () {
                    rest_modules
                        .create({name: $scope.name, ProjectID: data.projectid})
                        .then(function (data) {
                            switch (data.result) {
                                case 0:
                                    $uibModalInstance.close();
                                    break;
                                default :
                                    $scope.error = data.Message;
                                    break;
                            }
                        });
                };
                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: '$ctrl',
            resolve: {
                data: function () {
                    return {
                        //component: component
                        projectid: $scope.projectid
                    };
                }
            }
        });

        modalInstance.result.then(function (returntext) {
        }, function () {
        });
    }

    // 显示连接设置模态框
    $scope.showconnectsmodal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            //size: 'lg',
            templateUrl: 'admin/connects/index.html',
            //template: '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$ctrl.cancel()"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title"> 创建模块</h3>\n</div>\n<div class="modal-body">\n    <div class="form-group">\n        <label class="control-label">模块名称</label>\n        <input ng-model="name" class="form-control" >\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>\n    <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Cancel</button>\n</div>',
            controller: 'ConnectListController',
            controllerAs: '$ctrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load('admin/connects/ctrl.js');
                    }],
                data: function () {
                    return {
                        //component: component
                        projectid: $scope.projectid
                    };
                }
            }
        });

        modalInstance.result.then(function (returntext) {
        }, function () {
        });
    }

    // 显示邀请对话框
    $scope.showinvitationmodal = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            //size: 'lg',
            templateUrl: 'admin/users/invitation.html',
            //template: '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$ctrl.cancel()"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title"> 创建模块</h3>\n</div>\n<div class="modal-body">\n    <div class="form-group">\n        <label class="control-label">模块名称</label>\n        <input ng-model="name" class="form-control" >\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>\n    <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Cancel</button>\n</div>',
            controller: function ($scope, rest_projects, data) {
                $scope.projectid = data.projectid;
                $scope.email = '';
                $scope.invite = function () {
                    if ($scope.email && $scope.email.length > 0) {
                        // 发送邀请邮件
                        rest_projects
                            .invite($scope.projectid, $scope.email)
                            .then(function (data) {
                                if (data.result == 0) {
                                    alert('邮件发送成功')
                                }
                                else {
                                    alert(data.message)
                                }
                            })
                    }
                }
            },
            controllerAs: '$ctrl',
            resolve: {
                deps: ['$ocLazyLoad',
                    function ($ocLazyLoad) {
                        return $ocLazyLoad.load('admin/connects/ctrl.js');
                    }],
                data: function () {
                    return {
                        //component: component
                        projectid: $scope.projectid
                    };
                }
            }
        });

        modalInstance.result.then(function (returntext) {
        }, function () {
        });
    }
});

app.controller("ProjectSettingsController", function ($scope, $state, $stateParams, rest_projects, rest_pages) {
    $scope.projectid = $stateParams.projectid;
    // $scope.pinpagelistbar = false;
    $scope.project = {};
    $scope.users = [];
    $scope.pages = [];
    $scope.editingnav = {model: null};
    $scope.configs = {
        project_nav: {
            list: [{
                title: 'aaaa',
                children: [],
                icon: 'fa fa-fw fa-file-o'
            }]
        }
    }

    $scope.loadprojectinfo = function () {
        // 获取项目列表
        rest_projects
            .info($scope.projectid)
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        $scope.project = data.data;
                        if ($scope.project.Configs.length > 0) {
                            $scope.configs = JSON.parse($scope.project.Configs);
                        }
                        // if (project.Configs.project_nav.list)
                        break;
                    default :
                        alert('项目不存在');
                        break;
                }
            }, function (resp) {
                console.log(resp);
                alert(resp);
            });
    };
    $scope.loadprojectinfo();

    // 获取所有的页面列表
    $scope.loadpages = function () {
        rest_pages
            .list({ProjectID: $scope.projectid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    // alert(data);
                    // 显示数据
                    $scope.pages = data.data;
                    if ($state.is('app.project')) {
                        console.log($stateParams.pageid)
                        if (!$stateParams.pageid && $scope.pages.length > 0) {
                            for (var i = 0; i < $scope.pages.length; i++) {
                                if ($scope.pages[i].IsPublic == 1) {
                                    $state.go('app.project.page', {projectid: $scope.projectid, pageid: $scope.pages[i].ID});
                                    break;
                                }
                            }
                        }
                    }

                }
                else {
                    alert(data.message);
                }
            });
    };
    $scope.loadpages();

    // 获取项目所有成员
    $scope.loadusers = function () {
        rest_projects
            .users($scope.projectid)
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    // alert(data);
                    // 显示数据
                    $scope.users = data.data;
                }
                else {
                    alert(data.message);
                }
            });
    };
    $scope.loadusers();

    $scope.save = function () {
        $scope.project.Configs = JSON.stringify($scope.configs);
        rest_projects
            .update($scope.project)
            .then(function (data) {
                if (data.result == 0) {
                    $state.reload();
                }
                else {
                    alert(data.message);
                }
            })
    }


    $scope.state2href = function (name, params) {
        return $state.href(name, params);
    }

    $scope.app.appcontentfull = true;
    $scope.app.hideFooter = true;
    $scope.$on("$destroy", function () {
        //$scope.app.hideAside = false;
        //清除配置,不然scroll会重复请求
        $scope.app.appcontentfull = false;
        $scope.app.hideFooter = false;
    })
});

