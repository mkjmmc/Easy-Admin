// 加载
app.controller('ConnectListController', function ($scope, $resource, $state, $stateParams, $localStorage, rest_projects, rest_modules, rest_pages, $uibModal, rest_connects) {

    $scope.projectid = $stateParams.projectid;
$scope.newconnect={};

    $scope.loadconnects = function () {
        rest_connects
            .list({ProjectID: $scope.projectid})
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
                }
                else {
                    alert(data.message)
                }
            });
    }
});
