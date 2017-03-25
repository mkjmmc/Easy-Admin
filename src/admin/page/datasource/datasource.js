'use strict';

app.directive('datasource', function () {
    return {
        restrict: 'E',
        template: '<div>\n    <div class="modal-header">\n        <h3 class="modal-title">\n            数据源</h3>\n    </div>\n    <div class="modal-body">\n        <div class="form-horizontal">\n            <div class="form-group">\n                <label class="col-sm-3 control-label">\n                    数据源名称</label>\n                <div class="col-sm-9">\n                    <input type="text" ng-model="data.name" class="form-control"/>\n                </div>\n            </div>\n            <div class="form-group">\n                <label class="col-sm-3 control-label">\n                    连接</label>\n                <div class="col-sm-9">\n                    <select ng-model="data.connectid"\n                            ng-options="val.ID as val.Name for (key,val) in connects"\n                            class="form-control">\n                    </select>\n                </div>\n            </div>\n            <div ng-repeat="config in data.configs">\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">\n                        类型</label>\n                    <div class="col-sm-9">\n                        <select ng-model="config.type" class="form-control">\n                            <option value="select">查询</option>\n                            <option value="insert">插入</option>\n                            <option value="update">更新</option>\n                            <!--<option value="remove">删除</option>-->\n                        </select>\n                    </div>\n                </div>\n                <div class="form-group" ng-if="config.type == \'select\'">\n                    <label class="col-sm-3 control-label">\n                        数据集名称</label>\n                    <div class="col-sm-9">\n                        <input type="text" ng-model="config.name" class="form-control"/>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">\n                        数据库</label>\n                    <div class="col-sm-9">\n                        <select ng-model="config.database" ng-options="key as key for (key,val) in connects[data.connectid].databases" class="form-control">\n                        </select>\n                    </div>\n                </div>\n                <div class="form-group">\n                    <label class="col-sm-3 control-label">\n                        表</label>\n                    <div class="col-sm-9">\n                        <select ng-model="config.table"\n                                ng-options="key as key for (key,val) in connects[data.connectid].databases[config.database]"\n                                class="form-control"\n                                ng-change="initconfig(config)">\n                        </select>\n                        <div ng-if="config.type == \'select\'">\n                            <!--<div ng-repeat="tb in config.join">-->\n                            <!--<div class="row no-margins">-->\n                            <!--<div class="col-sm-4 no-padding">-->\n                            <!--<select ng-model="tb.type" class="form-control">-->\n                            <!--<option value="inner">inner join</option>-->\n                            <!--<option value="left">left join</option>-->\n                            <!--<option value="right">right join</option>-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-6 no-padding">-->\n                            <!--<select ng-model="tb.table" ng-options="table.table as table.table for table in tablelist" class="form-control">-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-2 no-padding">-->\n                            <!--<a ng-click="config.join.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-2 no-padding">-->\n                            <!--<select class="form-control">-->\n                            <!--<option selected="selected">ON</option>-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-4 no-padding">-->\n                            <!--<select ng-model="tb.on[0]" ng-options="column as column.table+\'.\'+column.column_name for column in columnlist" class="form-control">-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-2 no-padding">-->\n                            <!--<select ng-model="tb.opt" class="form-control">-->\n                            <!--<option value="=">=</option>-->\n                            <!--<option value="<>">&lt;&gt;</option>-->\n                            <!--<option value="&lt;">&lt;</option>-->\n                            <!--<option value="&lt;=">&lt;=</option>-->\n                            <!--<option value="&gt;">&gt;</option>-->\n                            <!--<option value="&gt;=">&gt;=</option>-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--<div class="col-sm-4 no-padding">-->\n                            <!--<select ng-model="tb.on[1]" ng-options="column as column.table+\'.\'+column.column_name for column in columnlist" class="form-control">-->\n                            <!--</select>-->\n                            <!--</div>-->\n                            <!--</div>-->\n                            <!--</div>-->\n                            <!--<a ng-click="config.join.push({type:\'inner\',table:\'\',on:[\'\',\'\']})" class="btn btn-default"><i class="fa fa-plus"></i></a>-->\n                        </div>\n                    </div>\n                </div>\n                <div ng-if="config.type == \'select\' && config.table">\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            字段</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="column in connects[data.connectid].databases[config.database][config.table]">\n                                <label>\n                                    <input type="checkbox" ng-model="config.fields[column.column_name]"/>\n                                    {{column.column_name}} <span class="badge">{{column.data_type}}</span>\n                                </label>\n                            </div>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            条件</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="item in config.condition">\n                                <div class="row no-margins">\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.name" ng-options="column.column_name as column.column_name for column in connects[data.connectid].databases[config.database][config.table]" class="form-control">\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.opt" class="form-control">\n                                            <option value="=">=</option>\n                                            <option value="&lt;&gt;">&lt;&gt;</option>\n                                            <option value="&lt;">&lt;</option>\n                                            <option value=">&lt;=">&lt;=</option>\n                                            <option value="&gt;">&gt;</option>\n                                            <option value="&gt;=">&gt;=</option>\n                                            <option value="like">like</option>\n                                            <option value="not like">not like</option>\n                                            <option value="begin with">begin with</option>\n                                            <option value="end with">end with</option>\n                                            <option value="is null">is null</option>\n                                            <option value="is not null">is not null</option>\n                                            <option value="in dataset">in dataset</option>\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-4 no-padding">\n                                        <input ng-model="item.value" class="form-control" ng-if="item.opt != \'is null\' && item.opt != \'is not null\' && item.opt != \'in dataset\'"/>\n                                        <div ng-if="item.opt==\'in dataset\'">\n                                            <select ng-model="item.dataset" ng-options="cfg.name as cfg.name for cfg in data.configs | filter:{type:\'select\'}" class="form-control"></select>\n                                            <select ng-model="item.datasetcolumn" ng-options="key as key for (key,val) in data.configs | getchild:{type:\'select\', name:item.dataset}:\'fields\'" class="form-control"></select>\n                                        </div>\n                                    </div>\n                                    <div class="col-sm-2 no-padding">\n                                        <a ng-click="config.condition.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n                            </div>\n                            <a ng-click="config.condition.push({column_name:\'\',opt:\'等于\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            排序</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="item in config.sort">\n                                <div class="row no-margins">\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.name" ng-options="column.column_name as column.column_name for column in connects[data.connectid].databases[config.database][config.table]" class="form-control">\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.sort" class="form-control">\n                                            <option value="1">正序</option>\n                                            <option value="-1">倒序</option>\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-3 no-padding">\n                                        <a ng-click="config.sort.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n                            </div>\n                            <a ng-click="config.sort.push({column_name:\'\',order:\'1\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n                        </div>\n                    </div>\n                </div>\n                <div ng-if="config.type == \'update\' && config.table">\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            modifier</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="item in config.modifier">\n                                <div class="row no-margins">\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.name" ng-options="column.column_name as column.column_name for column in databases[config.database][config.table]" class="form-control">\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-4 no-padding">\n                                        <input ng-model="item.value" class="form-control"/>\n                                    </div>\n                                    <div class="col-sm-2 no-padding">\n                                        <a ng-click="config.modifier.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n                            </div>\n                            <a ng-click="config.modifier.push({name:\'\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n                        </div>\n                    </div>\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            condition</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="item in config.condition">\n                                <div class="row no-margins">\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.name" ng-options="column.column_name as column.column_name for column in connects[data.connectid].databases[config.database][config.table]" class="form-control">\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-4 no-padding">\n                                        <input ng-model="item.value" class="form-control"/>\n                                    </div>\n                                    <div class="col-sm-2 no-padding">\n                                        <a ng-click="config.condition.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n                            </div>\n                            <a ng-click="config.condition.push({name:\'\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n                        </div>\n                    </div>\n                </div>\n                <div ng-if="config.type == \'insert\' && config.table">\n                    <div class="form-group">\n                        <label class="col-sm-3 control-label">\n                            values</label>\n                        <div class="col-sm-9">\n                            <div ng-repeat="item in config.values">\n                                <div class="row no-margins">\n                                    <div class="col-sm-3 no-padding">\n                                        <select ng-model="item.name" ng-options="column.column_name as column.column_name for column in connects[data.connectid].databases[config.database][config.table]" class="form-control">\n                                        </select>\n                                    </div>\n                                    <div class="col-sm-4 no-padding">\n                                        <input ng-model="item.value" class="form-control"/>\n                                    </div>\n                                    <div class="col-sm-2 no-padding">\n                                        <a ng-click="config.values.splice($index,1)" class="btn btn-default"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n                            </div>\n                            <a ng-click="config.values.push({name:\'\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n                        </div>\n                    </div>\n                </div>\n                <a ng-click="$parent.data.configs.splice($index,1)">删除</a>\n            </div>\n            <a ng-click="addconfig()">添加</a>\n        </div>\n    </div>\n    {{data}}\n    <br/>\n    <br/>\n    {{tablelist}}\n    <br/>\n    <br/>\n    <div>\n        {{connects}}\n    </div>\n    <div class="modal-footer">\n        <button class="btn btn-primary" type="button" ng-click="ok()">\n            OK\n        </button>\n        <button class="btn btn-warning" type="button" ng-click="cancel()">\n            Cancel\n        </button>\n    </div>\n</div>',
        replace: true,
        scope: {
            config: "="
        },
        controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $timeout, $q) {
            $scope.defaultdata = {
                name: '数据源',
                connectid: 0,
                configs: []
            };
            // 数据初始化
            $scope.data = $scope.config = angular.extend($scope.config, angular.extend($scope.defaultdata, $scope.config));

            $scope.connects = null;

            // 初始化数据库
            $scope.initdatabase = function () {
                watchconfigs();
            };
            // 监控配置的变化，并进行查询
            var watchconfigs = function () {
                // 监控数据库配置的变化，并进行相关数据查询
                $scope.$watch(function () {
                    return $scope.config;
                }, function (newValue, oldValue) {
                    if (newValue) {
                        (function loop(i) {
                            var chain = $q.when();
                            chain = chain.then(function () {
                                return $scope.getconnects();
                            }).then(function () {
                                return $scope.getdatabases($scope.config.connectid);
                            }).then(function () {
                                return $scope.gettablelist($scope.config.connectid, newValue.configs[i].database);
                            }).then(function () {
                                return $scope.getcolumnlist($scope.config.connectid, newValue.configs[i].database, newValue.configs[i].table);
                            }).then(function () {
                                i > newValue.configs.length - 2 || loop(i + 1);
                            });
                        })(0);
                    }
                }, true);
            };

            // 添加数据源
            $scope.addconfig = function () {
                var config = {
                    type: 'select',
                    database: '',
                    table: '',
                    fields: {},
                    condition: [],
                    sort: [],
                    limit: [],
                    modifier: [],
                    values: []
                };
                $scope.config.configs.push(config);
            };

            // 数据源表变化时触发，重置部分配置
            $scope.initconfig = function (config) {
                config.fields = {};
                config.condition = [];
                config.sort = [];
                config.limit = [];
                config.modifier = [];
                config.values = [];
            };


            // 获取连接字符串
            $scope.getconnects = function () {
                var delay = $q.defer();
                if (!$scope.connects) {
                    var $com = $resource('/enter/query/Connects');
                    $com.get(null, function (data) {
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
            $scope.getdatabases = function (connectid)  {
                var delay = $q.defer();
                if ($scope.connects
                    && $scope.connects[connectid]
                    && !$scope.connects[connectid].databases) {
                    var $com = $resource('/enter/query/Databases');
                    $com.get({connectid: connectid}, function (data) {
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
                    var $com = $resource('/enter/query/TableList');
                    $com.query({
                        connectid: connectid,
                        databasename: databasename
                    }, function (data) {
                        if (!$scope.connects[connectid].databases[databasename]) {
                            $scope.connects[connectid].databases[databasename] = {};
                        }
                        for (var i = 0; i < data.length; i++) {
                            if (!$scope.connects[connectid].databases[databasename][data[i]]) {
                                $scope.connects[connectid].databases[databasename][data[i]] = null
                            }
                        }
                        delay.resolve();
                    }, function (resp) {
                        delay.reject(resp);
                    });
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
                    var $com = $resource('/enter/query/columnList');
                    $com.query({
                        connectid: connectid,
                        databasename: databasename,
                        tablename: tablename
                    }, function (data) {
                        $scope.connects[connectid].databases[databasename][tablename] = data;
                        delay.resolve();
                    }, function (resp) {
                        delay.reject(resp);
                    });
                }
                else {
                    delay.resolve();
                }
                return delay.promise;
            };

            $scope.initdatabase();

            $scope.gettable = function (tablename) {
                for (var i = 0; i < $scope.tablelist.length; i++) {
                    if ($scope.tablelist[i].table === tablename) {
                        return $scope.tablelist[i];
                    }
                }
                return null;
            };


            // 获取所有的列信息
            $scope.getcolumns = function () {
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

        }
    };
});