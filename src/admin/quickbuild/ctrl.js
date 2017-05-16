/**
 * 1.选择数据库表
 * 2.确定表关联
 * 3.定义字段类型
 * 4.选择模板（暂时忽略）
 * 5.生成相关页面
 */
app.controller('QuickBuildController', function ($scope, $q, rest_connects, $stateParams, $resource, $state, $localStorage, rest_projects, rest_modules, rest_pages, $uibModal) {
    $scope.step = 0;

    $scope.config = {};
    $scope.connects = null;
    $scope.editing = {column: null};

    // 获取连接字符串
    $scope.getconnects = function () {
        var delay = $q.defer();
        if (!$scope.connects) {
            rest_connects
                .list($stateParams.projectid)
                .then(function (data) {
                    if (data.result == 0) {
                        if (!$scope.connects) {
                            $scope.connects = [];
                        }
                        for (var i = 0; i < data.data.length; i++) {
                            if (!$scope.connects[data.data[i].ID]) {
                                $scope.connects[data.data[i].ID] = {};
                            }
                            $scope.connects[data.data[i].ID].ID = data.data[i].ID;
                            $scope.connects[data.data[i].ID].Name = data.data[i].Name;
                        }
                        delay.resolve();
                        //$scope.connects = data.data;
                    } else {
                        //alert(data.message);
                        delay.reject(data.message);
                    }
                }, function (resp) {
                    delay.reject(resp);
                    console.log("getdatabases error", resp);
                });
        } else {
            delay.resolve();
        }
        return delay.promise;
    };
    // 获取数据库
    $scope.getdatabases = function (connectid) {
        var delay = $q.defer();
        if ($scope.connects
            && $scope.connects[connectid]
            && !$scope.connects[connectid].databases) {
            rest_connects
                .databases($stateParams.projectid, connectid)
                .then(function (data) {
                    if (data.result == 0) {
                        if (!$scope.connects[connectid].databases) {
                            $scope.connects[connectid].databases = {};
                        }
                        for (var i = 0; i < data.data.length; i++) {
                            if (!$scope.connects[connectid].databases[data.data[i]]) {
                                $scope.connects[connectid].databases[data.data[i]] = null;
                            }
                        }
                        delay.resolve();
                    } else {
                        delay.reject(data);
                    }
                }, function (resp) {
                    delay.reject(resp);
                });
            //var $com = $resource('/enter/query/Databases');
            //$com.get({connectid: connectid}, function (data) {
            //    if (data.result == 0) {
            //        if (!$scope.connects[connectid].databases) {
            //            $scope.connects[connectid].databases = {};
            //        }
            //        for (var i = 0; i < data.data.length; i++) {
            //            if (!$scope.connects[connectid].databases[data.data[i]]) {
            //                $scope.connects[connectid].databases[data.data[i]] = null;
            //            }
            //        }
            //        delay.resolve();
            //    } else {
            //        delay.reject(data);
            //    }
            //}, function (resp) {
            //    delay.reject(resp);
            //});
        }
        else {
            delay.resolve();
        }
        return delay.promise;
    };

    // 获取数据库表列表
    $scope.gettablelist = function (connectid, databasename) {
        var delay = $q.defer();
        if ($scope.connects
            && databasename
            && $scope.connects[connectid]
            && !$scope.connects[connectid].databases[databasename]) {
            rest_connects
                .tables($stateParams.projectid, connectid, databasename)
                .then(function (data) {
                    if (data.result == 0) {
                        if (!$scope.connects[connectid].databases[databasename]) {
                            $scope.connects[connectid].databases[databasename] = {};
                        }
                        for (var i = 0; i < data.data.length; i++) {
                            if (!$scope.connects[connectid].databases[databasename][data.data[i]]) {
                                $scope.connects[connectid].databases[databasename][data.data[i]] = null
                            }
                        }
                        delay.resolve();
                    }
                    else {
                        delay.reject(data.message);
                    }
                }, function (resp) {
                    delay.reject(resp);
                });

            //var $com = $resource('/enter/query/TableList');
            //$com.query({
            //    connectid: connectid,
            //    databasename: databasename
            //}, function (data) {
            //    if (!$scope.connects[connectid].databases[databasename]) {
            //        $scope.connects[connectid].databases[databasename] = {};
            //    }
            //    for (var i = 0; i < data.length; i++) {
            //        if (!$scope.connects[connectid].databases[databasename][data[i]]) {
            //            $scope.connects[connectid].databases[databasename][data[i]] = null
            //        }
            //    }
            //    delay.resolve();
            //}, function (resp) {
            //    delay.reject(resp);
            //});
        } else {
            delay.resolve();
        }
        return delay.promise;
    }
    //$scope.gettablelist();

    // 获取表所有的列
    $scope.getcolumnlist = function (connectid, databasename, tablename) {
        var delay = $q.defer();
        if ($scope.connects
            && databasename
            && tablename
            && $scope.connects[connectid]
            && $scope.connects[connectid].databases[databasename]
            && !$scope.connects[connectid].databases[databasename][tablename]
        ) {
            rest_connects
                .columns($stateParams.projectid, connectid, databasename, tablename)
                .then(function (data) {
                    if (data.result == 0) {
                        $scope.connects[connectid].databases[databasename][tablename] = data.data;
                        delay.resolve(data.data);
                    }
                    else {
                        delay.reject(data.message);
                    }
                }, function (resp) {
                    delay.reject(resp);
                });
            //var $com = $resource('/enter/query/columnList');
            //$com.query({
            //    connectid: connectid,
            //    databasename: databasename,
            //    tablename: tablename
            //}, function (data) {
            //    $scope.connects[connectid].databases[databasename][tablename] = data;
            //    delay.resolve();
            //}, function (resp) {
            //    delay.reject(resp);
            //});
        }
        else {
            delay.resolve($scope.connects[connectid].databases[databasename][tablename]);
        }
        return delay.promise;
    };

    $scope.getconnects();

    $scope.addtable = function (tablename) {
        if (!$scope.config.tables) {
            $scope.config.tables = {};
        }
        if (!$scope.config.tables[tablename]) {
            $scope.config.tables[tablename] = {};
            // 获取列信息
            $scope.getcolumnlist($scope.config.connectid, $scope.config.database, tablename)
                .then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var name = data[i].column_name;
                        var type = getdatatype(data[i].data_type);
                        $scope.config.tables[tablename][name] = {
                            display: true,
                            displayname: name,
                            datatype: data[i].data_type,
                            primary_key: data[i].primary_key,
                            type: type,
                            options:[],
                            link:{}
                        };
                        if (type == 'number') {
                            $scope.config.tables[tablename][name].fractionSize = 0
                        }
                        if(name.toLowerCase().indexOf('time') > 0 && data[i].data_type == 'bigint' ){
                            $scope.config.tables[tablename][name].type='timestamp';
                        }
                    }
                    //$scope.config.tables[tablename] = data;
                })
        }
    };
    var getcolumnconfig = function(data){

    }

    // 数据库类型转换为显示格式类型
    var getdatatype = function (datatype) {
        if (["int", "bigint", "long", "tinyint"].indexOf(datatype) >= 0) {
            return "number";
        }
        if (["varchar", "nvarchar", "char", "nchar", "uniqueidentifier"].indexOf(datatype) >= 0) {
            return "text";
        }
        if (["longtext"].indexOf(datatype) >= 0) {
            return "textarea";
        }
        if (["datetime", "datetime2"].indexOf(datatype) >= 0) {
            return "datetime";
        }
    };
    $scope.removetable = function (tablename) {
        if (!$scope.config.tables) {
            $scope.config.tables = {};
        }
        delete $scope.config.tables[tablename];
    };
    $scope.addlink = function () {
        if (!$scope.config.links) {
            $scope.config.links = [];
        }
        $scope.config.links.push({});
    };

    // 生成页面
    $scope.createpages = function(){

    }


    $scope.$on("$destroy", function() {
        //$scope.app.hideAside = false;
        //清除配置,不然scroll会重复请求
       $scope. app.appcontentfull = false;
       $scope. app.hideFooter=false;
    })
});

