'use strict';
app.directive('listGroupConfig', function () {
    return {
        restrict: 'E',
        template: '<div>\
        <div class="row">\
                <div class="col-xs-3">\
                    <div>\
                        <select ng-model="config.datasource" ng-options="datasource.name as datasource.name for datasource in datasources" class="form-control"></select>\
                    </div>\
                    <div ng-repeat="cfg in datasources | getchild:{name:config.datasource}:\'configs\' " class="panel panel-default">\
                        <div class="panel-heading">{{cfg.name}}</div>\
                        <div class="list-group" style=" overflow: auto">\
                            <a ng-repeat="(key,val) in cfg.fields" class="list-group-item" ng-click="config.columns.push({display:true,displayname:key,column_name:key,formater:\'\\{\\{row.\'+key+\'\\}\\}\'})">\
                                {{key}}\
                            </a>\
                        </div>\
                    </div>\
                </div>\
                <div class="col-xs-9">\
                    <div><textarea ng-model="config.template" class="form-control" rows="20"></textarea></div>\
                    <uib-tabset active="active">\
                <uib-tab index="0">\
                    <uib-tab-heading>显示\
                    </uib-tab-heading>\
                    <div style="overflow: auto;">\
                        <div class="form-inline">\
                            名称：\
                            <input type="text" ng-model="config.title" class="form-control"/>\
                            表\
                            <select ng-model="config.table" ng-options="cfg.name as cfg.name for cfg in datasources | getchild:{name:config.datasource}:\'configs\'" class="form-control">\
                            </select>\
                            类型： \
                            <select ng-model="config.type" class="form-control">\
                                <option value="list">列表</option>\
                                <option value="detail">详情</option>\
                            </select>\
                        </div>\
                        <table class="table table-striped table-bordered table-condensed">\
                            <thead>\
                            <tr>\
                                <th><input type="checkbox" ng-model="allselected" ng-click="selectall(allselected, config.columns, \'display\')"/></th>\
                                <th>显示名称</th>\
                                <th>格式化</th>\
                                <th>对齐</th>\
                                <th>对应字段</th>\
                                <th>设置</th>\
                                <th></th>\
                                \
                            </tr>\
                            </thead>\
                            <tbody  ui-sortable ng-model="config.columns">\
                            <tr ng-repeat="column in config.columns">\
                                <td><input type="checkbox" ng-model="column.display"/></td>\
                                <td>\
                                    <input type="text" ng-model="column.displayname" class="form-control"/></td>\
                                <td>\
                                    <input type="text" ng-model="column.formater" class="form-control"/>\
                                </td>\
                                <td>\
                                    <select ng-model="column.align" class="form-control">\
                                        <option value="left">左对齐</option>\
                                        <option value="center">居中</option>\
                                        <option value="right">右对齐</option>\
                                    </select>\
                                </td>\
                                <td>\
                                    <select ng-model="column.column_name" ng-options="key as key for (key,val) in datasources | getchild:{name:config.datasource}:\'configs\' | getchild:{name:config.table}:\'fields\'" class="form-control"></select>\
                                </td>\
                                <td>\
                                    <div ng-if="column.column_name && column.column_name.length>0">\
                                        <label><input type="checkbox" ng-model="column.isfilter"/>筛选</label>\
                                        <label><input type="checkbox" ng-model="column.isorderby"/>排序</label>\
                                        <label><input type="checkbox" ng-model="column.isedit"/>修改</label>\
                                        <label><input type="checkbox" ng-model="column.isenum"/>枚举</label>\
                                        <div ng-if="column.isenum" ng-init="column.options= !column.options ? []:column.options">\
                                            <table>\
                                                <tr ng-repeat="option in column.options">\
                                                    <td><input type="text" ng-model="option.label" class="form-control"/></td>\
                                                    <td><input type="text" ng-model="option.value" class="form-control"/></td>\
                                                </tr>\
                                            </table>\
                                            <a ng-click="column.options.push({label:\'\',value:\'\'})">添加</a>\
                                        </div>\
                                    </div>\
                                </td>\
                                <td><a ng-click="config.columns.splice($index,1)"><i class="fa fa-close"></i></a></td>\
                                \
                            </tr>\
                            </tbody>\
                        </table>\
                        <a ng-click="config.columns.push({display:true,displayname:\'\',formater:\'\'})">添加</a>\
                    </div>\
                </uib-tab>\
                <uib-tab index="1">\
                    <uib-tab-heading>\
                        筛选\
                    </uib-tab-heading>\
                    <div style=" overflow: auto;">\
                        <table>\
                            <tr ng-repeat="item in config.condition">\
                                <td>\
                                    <select ng-model="item.name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isfilter:true}" class="form-control"></select>\
                                </td>\
                                <td>\
                                <select ng-model="item.opt" class="form-control">\
                                    <option value="=">=</option>\
                                    <option value="&lt;&gt;">&lt;&gt;</option>\
                                    <option value="&lt;">&lt;</option>\
                                    <option value=">&lt;=">&lt;=</option>\
                                    <option value="&gt;">&gt;</option>\
                                    <option value="&gt;=">&gt;=</option>\
                                    <option value="like">like</option>\
                                    <option value="not like">not like</option>\
                                    <option value="begin with">begin with</option>\
                                    <option value="end with">end with</option>\
                                    <option value="is null">is null</option>\
                                    <option value="is not null">is not null</option>\
                                </select>\
                                </td>\
                                <td>\
                                    <input ng-model="item.value" ng-if="!getcolumn(item.name).isenum" class="form-control" ng-if="item.opt != \'is null\' && item.opt != \'is not null\'"/>\
                                    <select ng-model="item.value" ng-if="getcolumn(item.name).isenum && getcolumn(item.name).options && getcolumn(item.name).options.length>0"\
                                        ng-options="option.value as option.label for option in getcolumn(item.name).options" class="form-control"></select>\
                                        \
                                </td>\
                                <td><a ng-click="config.condition.splice($index,1)">删除</a></td>\
                            </tr>\
                        </table>\
                        <a ng-click="config.condition.push({name:\'\',opt:\'=\',value:\'\'})">添加</a>\
                    </div>\
                </uib-tab>\
                <uib-tab index="2">\
                    <uib-tab-heading>\
                        排序\
                    </uib-tab-heading>\
                    <div style="overflow: auto;">\
                        <table>\
                            <tr ng-repeat="item in config.orderby">\
                                <td>\
                                    <select ng-model="item.column_name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isorderby:true}" class="form-control"></select>\
                                </td>\
                                <td>\
                                    <a ng-click="item.order = item.order==\'ASC\' ? \'DESC\' : \'ASC\'">{{item.order}}</a>\
                                </td>\
                                <td><a ng-click="config.orderby.splice($index,1)">删除</a></td>\
                            </tr>\
                        </table>\
                        <a ng-click="config.orderby.push({column_name:\'\',order:\'ASC\'})">添加</a>\
                    </div>\
                </uib-tab>\
            </uib-tabset>\
                </div>\
            </div>\
            <div>{{config}}</div>\
            <datatable config="config"  variables="variables" loaddata="loaddata1(name,config)"></datatable>\
            </div>\
            ',
        replace: true,
        scope: {
            config: "=",
            datasources: "=",
            loaddata: "&"
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

        }
    };
});
 