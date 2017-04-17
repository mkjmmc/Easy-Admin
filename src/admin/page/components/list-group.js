'use strict';
app.directive('listGroupConfig', function () {
    return {
        restrict: 'E',
        template: '<div>\n    <div class="row">\n        <div class="col-xs-3">\n            <div>\n                <select ng-model="config.datasource" ng-options="datasource.name as datasource.name for datasource in datasources" class="form-control"></select>\n            </div>\n            <div ng-repeat="cfg in datasources | getchild:{name:config.datasource}:\'configs\' " class="panel panel-default">\n                <div class="panel-heading">{{cfg.name}}</div>\n                <div class="list-group" style=" overflow: auto">\n                    <a ng-repeat="(key,val) in cfg.fields" class="list-group-item" ng-click="config.columns.push({display:true,displayname:key,column_name:key,formater:\'\\{\\{row.\'+key+\'\\}\\}\'})">\n                        {{key}}\n                    </a>\n                </div>\n            </div>\n        </div>\n        <div class="col-xs-9">\n            <uib-tabset active="active">\n                <uib-tab index="0">\n                    <uib-tab-heading>显示\n                    </uib-tab-heading>\n                    <div style="overflow: auto;">\n                        <div class="form-inline">\n                            名称：\n                            <input type="text" ng-model="config.title" class="form-control"/>\n                            表\n                            <select ng-model="config.table" ng-options="cfg.name as cfg.name for cfg in datasources | getchild:{name:config.datasource}:\'configs\'" class="form-control">\n                            </select>\n                            类型：\n                            <select ng-model="config.type" class="form-control">\n                                <option value="list">列表</option>\n                                <option value="detail">详情</option>\n                            </select>\n                        </div>\n                        <div><textarea ng-model="config.template" class="form-control" rows="20"></textarea></div>\n                    </div>\n                </uib-tab>\n                <uib-tab index="1">\n                    <uib-tab-heading>\n                        筛选\n                    </uib-tab-heading>\n                    <div style=" overflow: auto;">\n                        <table>\n                            <tr ng-repeat="item in config.condition">\n                                <td>\n                                    <select ng-model="item.name" ng-options="key as key for (key,val) in datasources  | getchild:{name:config.datasource}:\'configs\' | getchild:{name:config.table}:\'fields\'" class="form-control"></select>\n                                </td>\n                                <td>\n                                    <select ng-model="item.opt" class="form-control">\n                                        <option value="=">=</option>\n                                        <option value="&lt;&gt;">&lt;&gt;</option>\n                                        <option value="&lt;">&lt;</option>\n                                        <option value=">&lt;=">&lt;=</option>\n                                        <option value="&gt;">&gt;</option>\n                                        <option value="&gt;=">&gt;=</option>\n                                        <option value="like">like</option>\n                                        <option value="not like">not like</option>\n                                        <option value="begin with">begin with</option>\n                                        <option value="end with">end with</option>\n                                        <option value="is null">is null</option>\n                                        <option value="is not null">is not null</option>\n                                    </select>\n                                </td>\n                                <td>\n                                    <input ng-model="item.value" ng-if="!getcolumn(item.name).isenum" class="form-control" ng-if="item.opt != \'is null\' && item.opt != \'is not null\'"/>\n                                    <select ng-model="item.value" ng-if="getcolumn(item.name).isenum && getcolumn(item.name).options && getcolumn(item.name).options.length>0"\n                                            ng-options="option.value as option.label for option in getcolumn(item.name).options" class="form-control"></select>\n\n                                </td>\n                                <td><a ng-click="config.condition.splice($index,1)">删除</a></td>\n                            </tr>\n                        </table>\n                        <a ng-click="config.condition.push({name:\'\',opt:\'=\',value:\'\'})">添加</a>\n                    </div>\n                </uib-tab>\n                <uib-tab index="2">\n                    <uib-tab-heading>\n                        排序\n                    </uib-tab-heading>\n                    <div style="overflow: auto;">\n                        <table>\n                            <tr ng-repeat="item in config.orderby">\n                                <td>\n                                    <select ng-model="item.column_name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isorderby:true}" class="form-control"></select>\n                                </td>\n                                <td>\n                                    <a ng-click="item.order = item.order==\'ASC\' ? \'DESC\' : \'ASC\'">{{item.order}}</a>\n                                </td>\n                                <td><a ng-click="config.orderby.splice($index,1)">删除</a></td>\n                            </tr>\n                        </table>\n                        <a ng-click="config.orderby.push({column_name:\'\',order:\'ASC\'})">添加</a>\n                    </div>\n                </uib-tab>\n            </uib-tabset>\n        </div>\n    </div>\n    <div>{{config}}</div>\n</div>\n            ',
        replace: true,
        scope: {
            config: "=",
            datasources: "=",
            loaddata: "&",
            ondataupdate: "&"// 数据更新
        },
        controller: function ($scope, $resource, $uibModal, $timeout) {

            $scope.connects = [];
            $scope.databases = [];
            $scope.tablelist = [];
            $scope.columnlist = [];
            $scope.data = null;
            $scope.defaultconfig = {
                // "connectid": 1,
                // "database": "",
                "title": "查询",
                "table": "gf_kecheng",
                "columns": [],
                "condition": [],
                "orderby": [],
                "page": 1,
                "pagesize": 20
            };

            // 配置初始化
            $scope.config = angular.extend($scope.config, angular.extend($scope.defaultconfig, $scope.config));


            $scope.loaddata1 = function (name, config) {
                return $scope.loaddata({"name": name, "config": config});
            }

            // $scope.getdata($stateParams.page, $stateParams.search);

            $scope.selectall = function (selected, datalist, name) {
                for (var i = 0; i < datalist.length; i++) {
                    datalist[i][name] = selected;
                }
            }

            $scope.getcolumn = function (column_name) {
                for (var i = 0; i < $scope.config.columns.length; i++) {
                    if ($scope.config.columns[i].column_name == column_name) {
                        return $scope.config.columns[i];
                    }
                }
                return null;
            }

            $scope.getdisplayname = function (column_name) {
                var column = $scope.getcolumn(column_name);
                if (column) {
                    if (column.displayname && column.displayname.length > 0) {
                        return column.displayname;
                    }
                }
                return column_name;

            }

        }
    };
});


app.directive('listGroup', function () {
    return {
        restrict: 'E',
        template: '<ul class="list-group">\n    <div ng-if="0" ng-repeat-start="row in data.data[config.table].data"></div>\n        <span bind-html-compile="config.template" replace="true"></span>\n    <div ng-if="0" ng-repeat-end></div>\n\n</ul>',
        replace: true,
        scope: {
            config: "=",
            datasource: "=",
            variables: "=",
            loaddata: "&", // 数据查询
            ondataupdate: "&"// 数据更新
            //onLoadCallback : "&"
        },
        controller: function ($scope, $resource, $uibModal, $location, $interpolate) {

            // 系统变量
            // $scope.Variables = $scope.variables;
            //$scope.currentPage = 1;

            $scope.$on("datasource.reload", function (event, data) {
                if (data.datasourcename == $scope.config.datasource) {
                    $scope.getdata($scope.page);
                }
            });
            // 查询数据
            $scope.getdata = function (page) {

                $scope.loaddata({name: $scope.config.datasource, config: {}}).then(function (data) {
                    $scope.data = data;
                });
            }

            $scope.getdata($scope.page);


            $scope.dataupdate = function (modifier, condition) {
                var md = [];
                var cd = [];
                for (var p in modifier) {
                    md.push({name: p, value: modifier[p]});
                }

                for (var p in condition) {
                    cd.push({name: p, opt: '=', value: condition[p]});
                }
                if(cd.length==0){
                    alert('未设置该表的主键，不建议更新');
                    return;
                }
                var connectid = $scope.data.connectid;
                var database = $scope.data.data[$scope.config.table].database;
                var table = $scope.data.data[$scope.config.table].table;
                // data.data[$scope.config.table].data
                $scope.updatedata(connectid, database, table, cd, md);
            }
            // 更新数据
            $scope.updatedata = function (connectid, database, table, condition, modifier) {
                var params = {
                    connectid: connectid,
                    configs: [
                        {
                            "type": "update",
                            "database": database,
                            "table": table,
                            "condition": condition,
                            "modifier": modifier,
                        }
                    ]
                };
                $scope.ondataupdate({config: params}).then(function (data) {
                    $scope.getdata($scope.page);
                }, function (resp) {
                    alert(resp);
                })
                // var $com = $resource('/enter/query/Update');
                // $com.save({}, params, function (data) {
                //     if (data && data.rows > 0) {
                //         // 更新成功，刷新数据
                //         $scope.getdata($scope.page);
                //     }
                //     console.log(data)
                // });
            }
        }
    };
});
 