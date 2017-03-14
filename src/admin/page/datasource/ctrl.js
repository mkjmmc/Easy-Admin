'use strict';
app.controller('DataSourceEditController', function($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, data, $uibModalInstance) {
    $scope.defaultdata = {
        name: '数据源',
        type: 'select',
        connectid: 0,
        database: '',
        table: '',
        join: [],
        fields: [],
        condition: [],
        sort: []
    };

    // 数据初始化
    $scope.data = data.datasource = angular.extend(data.datasource, angular.extend($scope.defaultdata, data.datasource));


    $scope.connects = [];
    $scope.databases = [];
    $scope.tablelist = [];
    $scope.columnlist =  $scope.data.fields;

    $scope.deletesort = function(key) {
        delete $scope.data.sort[key];
    }

    // 初始化数据库
    $scope.initdatabase = function() {
        // 监控表的变化刷新列信息
        // 连接变化
        $scope.$watch(function() {
            return $scope.data.connectid;
        }, function(newValue, oldValue) {
            $scope.getdatabases();
        });
        // 数据库变化
        $scope.$watch(function() {
            return $scope.data.database;
        }, function(newValue, oldValue) {
            $scope.gettablelist($scope.data.connectid, newValue);
        });
        $scope.$watch(function() {
            return $scope.data.table;
        }, function(newValue, oldValue) {
            if ($scope.data.table && $scope.data.table.length > 0) {
                $scope.getcolumnlist($scope.data.connectid, $scope.data.database, newValue);
            }
        });
        $scope.getconnects();
    }

    // 获取连接字符串
    $scope.getconnects = function() {
        var $com = $resource('/enter/query/Connects');
        $com.get(null, function(data) {
            if (data.result == 0) {
                $scope.connects = data.data;
            } else {
                alert(data.message);
            }
        }, function(resp) {
            console.log("getdatabases error", resp);
        });
    }

    // 获取数据库
    $scope.getdatabases = function() {
        var $com = $resource('/enter/query/Databases');
        $com.get({ connectid: $scope.data.connectid }, function(data) {
            if (data.result == 0) {
                $scope.databases = data.data;
            } else {
                alert(data.message);
            }
        }, function(resp) {
            console.log("getdatabases error", resp);
        });
    }
    // $scope.getdatabases();

    // 获取数据库表列表
    $scope.gettablelist = function(connectid, databasename) {
        var $com = $resource('/enter/query/TableList');
        $com.query({
            connectid: connectid,
            databasename: databasename
        }, function(data) {
            // alert(data);
            // 显示数据
            $scope.tablelist = [];
            for (var i = 0; i < data.length; i++) {
                $scope.tablelist.push({
                    table: data[i],
                    columns: []
                });
            }
        }, function(resp) {
            console.log("tablelist error", resp);
        });
    }
    //$scope.gettablelist();

    // 获取表所有的列
    $scope.getcolumnlist = function(connectid, databasename, tablename) {
        var $com = $resource('/enter/query/columnList');
        $com.query({
            connectid: connectid,
            databasename: databasename,
            tablename: tablename
        }, function(data) {
            // alert(data);
            // 显示数据
            var table = $scope.gettable(tablename);
            if (table) {
                table.columns = data;
                   $scope.getcolumns();
     }
        }, function(resp) {
            console.log("columnlist error", resp);
        });
    }

    $scope.initdatabase();

    $scope.gettable = function(tablename) {
        for (var i = 0; i < $scope.tablelist.length; i++) {
            if ($scope.tablelist[i].table === tablename) {
                return $scope.tablelist[i];
            }
        }
        return null;
    }

    // 监视表的变化，并生成列信息
//    $scope.$watch(function () {
//        return $scope.data.table;
//    }, function (newValue, oldValue) {
//        $scope.columnlist = $scope.getcolumns();
//    });
//    $scope.$watch(function () {
//        return $scope.data.join;
//    }, function (newValue, oldValue) {
//        $scope.columnlist = $scope.getcolumns();
//    });

    // 获取所有的列信息
    $scope.getcolumns = function() {
        $scope.data.fields = $scope.columnlist = []; //$scope.columnlist.splice(0,$scope.columnlist.length);
        var columns = $scope.gettable($scope.data.table).columns;
        for (var j = 0; j < columns.length; j++) {
            var column = columns[j];
            $scope.columnlist.push({
                table: $scope.data.table,
                column_name: column.column_name,
                data_type: column.data_type,
                display: column.display,
            });
        }
        for (var k = 0; k < $scope.data.join.length; k++) {
            var tb = $scope.data.join[k];
            columns = $scope.gettable(tb.table).columns;
            for (var j = 0; j < columns.length; j++) {
                var column = columns[j];
                $scope.columnlist.push({
                    table: tb.table,
                    column_name: column.column_name,
                    data_type: column.data_type,
                    display: column.display,
                });
            }
        }
    }

    $scope.ok = function() {
        $uibModalInstance.close($scope.data);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
});