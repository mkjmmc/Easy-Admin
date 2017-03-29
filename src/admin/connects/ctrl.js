// 加载
app.controller('ConnectListController', function ($scope, $resource, $state, $stateParams, $localStorage, rest_projects, rest_modules, rest_pages, $uibModal, rest_connects) {

    $scope.projectid = $stateParams.projectid;
    $scope.newconnect = {};

    // 获取所有的连接
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
                }
                else {
                    alert(data.message);
                }
            });
    };
    $scope.loadconnects();

    // 更新
    $scope.updateconnect = function (connect) {
        rest_connects
            .update({
                ID: connect.ID,
                Name: connect.NameNew,
                ConnectString: connect.ConnectStringNew
            })
            .then(function (data) {
                if (data.result == 0) {
                    $scope.loadconnects();
                }
                else {
                    alert(data.message)
                }
            });
    };

    // 删除
    $scope.deleteconnect = function (connect) {
        if (confirm('是否删除该连接？删除后使用该连接的相关操作将不可用。')) {
            rest_connects
                .delete({
                    ID: connect.ID,
                })
                .then(function (data) {
                    if (data.result == 0) {
                        $scope.loadconnects();
                    }
                    else {
                        alert(data.message)
                    }
                });
        }
    };

    // 创建
    $scope.createconnect = function (connect) {
        rest_connects
            .create({
                ProjectID: $scope.projectid,
                Name: connect.NameNew,
                ConnectString: connect.ConnectStringNew
            })
            .then(function (data) {
                if (data.result == 0) {
                    $scope.loadconnects();
                    $scope.addnew = false;
                    $scope.newconnect = {};
                }
                else {
                    alert(data.message)
                }
            });
    }

    // 测试连接是否可用
    $scope.testconnect = function (connect) {
        connect.testmessage = "";
        rest_connects
            .test(connect.ConnectStringNew)
            .then(function (data) {
                if (data.result == 0) {
                    //$scope.loadconnects();
                    connect.testmessage = data.message;
                    connect.testok = true;
                }
                else {
                    connect.testok = false;
                    connect.testmessage = data.message;
                    //alert(data.message)
                }
            });
    }
});
