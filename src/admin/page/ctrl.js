'use strict';
app.controller('PageListController', function ($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, rest_pages) {
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
                    $state.go('page.list', {search: $scope.search_context, page: $scope.currentPage});
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
});
app.controller('PageEditController', function ($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, rest_pages,$localStorage) {
    // 初始数据
    $scope.Component = {
        type: 'page',
        name: '页面',
        children: []
    };
    $scope.editable = true;
    $scope.pageid = $stateParams.pageid;
    $scope.projectid = $stateParams.projectid;
    $scope.pageinfo={IsPublic:false};

    // 判断是否是创建者，只有创建者才能进入这个页面
    console.log($scope.users)
    if($scope.users){

    }

    $scope.$watch(function(){
        return $scope.users;
    }, function(newvalue){
        if(newvalue.length > 0){
            for(var i=0;i<newvalue.length;i++){
                if(newvalue[i].ID == $localStorage.user.ID && newvalue[i].Role==1){
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
            IsPublic:$scope.pageinfo.IsPublic
        };
        rest_pages
            .save(params)
            .then(function(data){
                if (data.result == 0) {
                    // 保存成功
                    $state.reload('app.project.design', {projectid:data.data.ProjectID, pageid:data.data.ID});
//                alert('保存成功');
                } else {
                    // 保存失败
                    alert('保存失败');
                }
            },function(resp){
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
                    $scope.Component = angular.extend($scope.Component, JSON.parse(data.data.Config));


//                $scope.getdata($stateParams.page, $stateParams.search);
//                     $scope.$parent.$parent.selectedpage = $scope.Component.name;
                }
                else {
                    alert(data.message);
                }
            });
//         var $com = $resource('/enter/query/GetQueryConfig');
//         $com.save(null, params, function (data) {
//             // alert(data);
//             // 显示数据
//             if (data.result == 0) {
//                 $scope.Component = angular.extend($scope.Component, JSON.parse(data.data.Config));
// //                $scope.getdata($stateParams.page, $stateParams.search);
//             }
//             else {
//                 alert(data.message);
//             }
// //            $scope.initdatabase();
//         }, function (resp) {
//             alert(resp);
//         });
    } else {
//            $scope.initdatabase();
    }
});


app.controller('PagePageController', function ($scope, $resource, $stateParams,rest_pages, $state, $parse, $filter, $timeout, $location) {
    // 初始数据
    $scope.Component = {
        type: 'page',
        name: '页面',
        children: []
    };

    if ($stateParams.pageid && $stateParams.pageid > 0) {
        // 获取配置

        rest_pages
            .detail({pageid: $stateParams.pageid})
            .then(function (data) {
                // alert(data);
                // 显示数据
                if (data.result == 0) {
                    $scope.Component = angular.extend($scope.Component, JSON.parse(data.data.Config));
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