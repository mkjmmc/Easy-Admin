'use strict';
app.controller('PageListController', function ($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, rest_pages) {

    $scope.sortableConfig = {
        sort: true,
        handle: '.d-handle',
        group: {
            name: 'advanced',
            pull: true,
            put: true
        },
        animation: 150,
        //onAdd: function (obj) {
        //    if (obj && obj.model) {
        //        if (!obj.model.id) {
        //            obj.model.id = obj.model.key = new Date().getTime();
        //        }
        //        if (obj.model.type == "row") {
        //            for (var i = 0; i < obj.model.children.length; i++) {
        //                obj.model.children[i].id = obj.model.children[i].key = new Date().getTime();
        //            }
        //        }
        //    }
        //},
        onUpdate: function (/**Event*/evt) {
            console.log(evt)
            for (var i = 0; i < $scope.data.data.length; i++) {
                $scope.data.data[i].OrderBy = i;
            }
            // 更新排序
            rest_pages
                .updateorderby($scope.projectid, $scope.data.data)
                .then(function () {

                });
            //var itemEl = evt.item;  // dragged HTMLElement
            // + indexes from onEnd
        }
    };
    // 查询列表
    $scope.getdata = function (page, search) {
        page = !page ? 1 : parseInt(page);
        var params = {
            page: page
        };
        $scope.projectid = $stateParams.projectid;

        rest_pages
            .list({ProjectID: $scope.projectid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                $scope.data = data;

                $scope.totalItems = data.totalItems;
                $scope.currentPage = data.currentPage;
                $scope.itemsPerPage = data.itemsPerPage;

                $scope.pageChanged = function () {
                    //                        $log.log('Page changed to: ' + $scope.currentPage);
                    $state.go('app.project.pages', {search: $scope.search_context, page: $scope.currentPage});
                };

                //                    $scope.maxSize = 5;
                //                    $scope.bigTotalItems = 175;
                //                    $scope.bigCurrentPage =
            });
        // var $com = $resource('/enter/query/GetQueryList');
        // $com.save(null, params, function (data) {
        //     // alert(data);
        //     // 显示数据
        //     $scope.data = data;
        //
        //     $scope.totalItems = data.totalItems;
        //     $scope.currentPage = data.currentPage;
        //     $scope.itemsPerPage = data.itemsPerPage;
        //
        //     $scope.pageChanged = function () {
        //         //                        $log.log('Page changed to: ' + $scope.currentPage);
        //         $state.go('page.list', { search: $scope.search_context, page: $scope.currentPage });
        //     };
        //
        //     //                    $scope.maxSize = 5;
        //     //                    $scope.bigTotalItems = 175;
        //     //                    $scope.bigCurrentPage = 1;
        //
        // }, function (resp) {
        //     //alert(resp);
        // });
    }
    $timeout(function () {
        $scope.getdata($stateParams.page, $stateParams.search);
    }, 100)

    $scope.gethref = function (name, params) {
        return $state.href(name, params);
    }
    $scope.deletepage = function (item) {
        if(confirm('是否删除该页面？')) {
            rest_pages
                .delete(item.ID)
                .then(function (data) {
                    if (data.result == 0) {
                        // 删除成功刷新列表
                        $scope.getdata($stateParams.page);
                    }
                    else {
                        alert(data.message);
                    }
                });
        }
    }

});
app.controller('PageEditController', function ($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, rest_pages, $localStorage) {
    // 初始数据
    // $scope.Component = {
    //     type: 'page',
    //     name: '页面',
    //     children: []
    // };
    $scope.Component = null;
    $scope.editable = true;
    $scope.pageid = $stateParams.pageid;
    $scope.projectid = $stateParams.projectid;
    $scope.pageinfo = {IsPublic: false};

    // 判断是否是创建者，只有创建者才能进入这个页面
    console.log($scope.users)
    if ($scope.users) {

    }

    $scope.$watch(function () {
        return $scope.users;
    }, function (newvalue) {
        if (newvalue.length > 0) {
            for (var i = 0; i < newvalue.length; i++) {
                if (newvalue[i].ID == $localStorage.user.ID && newvalue[i].Role == 1) {
                    return;
                }
            }
            $state.go("app.projects");
        }
    });


    // 保存查询配置
    $scope.savequery = function () {
        var params = {
            config: JSON.stringify($scope.Component),
            id: $scope.pageid,
            projectid: $scope.projectid,
            IsPublic: $scope.pageinfo.IsPublic
        };
        $scope.savePromise = rest_pages
            .save(params)
            .then(function (data) {
                if (data.result == 0) {
                    // 保存成功
                    $state.reload('app.project.design', {projectid: data.data.ProjectID, pageid: data.data.ID});
//                alert('保存成功');
                } else {
                    // 保存失败
                    alert('保存失败');
                }
            }, function (resp) {
                alert(resp);
            });
//        var $com = $resource('/enter/query/save');
//        $com.save(null, params, function (data) {
//            if (data.result == 0) {
//                // 保存成功
//                $state.go('page.list', {});
////                alert('保存成功');
//            } else {
//                // 保存失败
//                alert('保存失败');
//            }
//
//        }, function (resp) {
//            alert(resp);
//        });
    }

    if ($scope.pageid && $scope.pageid > 0) {
        // 获取配置
        // var params = {
        //     id: $stateParams.id,
        // }
        rest_pages
            .detail({pageid: $scope.pageid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    $scope.pageinfo = data.data;
                    $scope.Component = angular.extend({type: 'page', name: '页面', children: []}, JSON.parse(data.data.Config));
                }
                else {
                    alert(data.message);
                }
            });
    } else {
//            $scope.initdatabase();
    }


    $scope.$on("$destroy", function () {
        $scope.app.hideAside = false;
        //清除配置,不然scroll会重复请求
    })
});


app.controller('PagePageController', function ($scope, $resource, $stateParams, rest_pages, $state, $parse, $filter, $timeout, $location) {
    // 初始数据
    $scope.Component = null;

    if ($stateParams.pageid && $stateParams.pageid > 0) {
        // 获取配置

        rest_pages
            .detail({pageid: $stateParams.pageid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    $scope.Component = angular.extend({
                        type: 'page',
                        name: '页面',
                        children: []
                    }, JSON.parse(data.data.Config));
//                $scope.getdata($stateParams.page, $stateParams.search);
//                     $scope.$parent.$parent.selectedpage = $scope.Component.name;
                }
                else {
                    alert(data.message);
                }
            });

    } else {
//            $scope.initdatabase();
    }
});