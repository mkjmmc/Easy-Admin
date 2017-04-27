'use strict';
app.directive('datatableconfig', function () {
    return {
        restrict: 'E',
        template: '<div>\n    <div class="row">\n        <div class="col-xs-3">\n            <div>\n                <select ng-model="config.datasource" ng-options="datasource.name as datasource.name for datasource in datasources" class="form-control"></select>\n            </div>\n            <div ng-repeat="cfg in datasources | getchild:{name:config.datasource}:\'configs\' " class="panel panel-default">\n                <div class="panel-heading">{{cfg.name}}</div>\n                <div class="list-group" style=" overflow: auto">\n                    <a ng-repeat="(key,val) in cfg.fields" class="list-group-item" ng-click="config.columns.push({display:true,displayname:key,column_name:key,formater:\'\\{\\{row.\'+key+\'\\}\\}\'})">\n                        {{key}}\n                    </a>\n                </div>\n            </div>\n        </div>\n        <div class="col-xs-9">\n            <div class="form-inline wrapper-xs">\n                <!--名称：-->\n                <!--<input type="text" ng-model="config.title" class="form-control"/>-->\n                集合：\n                <select ng-model="config.table" ng-options="cfg.name as cfg.name for cfg in datasources | getchild:{name:config.datasource}:\'configs\'" class="form-control">\n                </select>\n                类型：\n                <select ng-model="config.type" class="form-control">\n                    <option value="list">列表</option>\n                    <option value="detail">详情</option>\n                </select>\n                每页记录数：<input type="text" ng-model="config.pagesize" class="form-control"/>\n            </div>\n            <uib-tabset active="active">\n                <uib-tab index="0">\n                    <uib-tab-heading>显示\n                    </uib-tab-heading>\n                    <div style="overflow: auto;">\n\n                        <div class="list-group">\n                            <div class="list-group-item" ng-repeat="column in config.columns">\n                                <div class="media">\n                                    <div class="media-left">\n                                        <input type="checkbox" icheck ng-model="column.display"/>\n                                    </div>\n                                    <div class="media-body">\n                                        <a class="text-dark " ng-hide="editing==true" ng-click="editing=true">\n                                            <h5 class="media-heading">{{column.displayname}}</h5>\n\n                                            <div>\n                                                <span ng-bind="column.type" class="text-success"></span>\n                                                <span ng-bind="column.column_name" class="bread text-info"></span>\n                                                <span ng-show="column.isfilter"><i class="fa fa-filter text-muted "></i></span>\n                                                <span ng-show="column.isorderby"><i class="fa fa-sort text-muted"></i></span>\n                                                <span ng-show="column.isedit"><i class="fa fa-pencil text-muted"></i></span>\n                                                <span ng-bind="column.align" ng-show="column.align" class="bread"></span>\n\n                                                <div>\n                                                    <span ng-bind="column.formater" ng-show="column.type==\'template\'"></span>\n                                                    <span ng-bind="column.fractionSize" ng-show="column.type==\'number\'"></span>\n                                                    <span ng-bind="column.datetimeformat" ng-show="column.type==\'datetime\'"></span>\n\n                                                    <div ng-show="column.type==\'enum\'">\n                                                        <div ng-repeat="opt in column.options">"{{opt.label}}":"{{opt.value}}"</div>\n                                                    </div>\n\n                                                </div>\n                                            </div>\n                                        </a>\n\n                                        <div ng-show="editing==true">\n                                            <div class="form-group">\n                                                <label>显示名称</label>\n                                                <input type="text" ng-model="column.displayname" class="form-control"/>\n                                            </div>\n                                            <div class="form-group">\n                                                <label>对齐方式</label>\n                                                <select ng-model="column.align" class="form-control">\n                                                    <option value="left">左对齐</option>\n                                                    <option value="center">居中</option>\n                                                    <option value="right">右对齐</option>\n                                                </select>\n                                            </div>\n                                            <div class="form-group">\n                                                <label>类型</label>\n                                                <select ng-model="column.type" class="form-control">\n                                                    <option value="text">文本</option>\n                                                    <option value="textarea">多行文本</option>\n                                                    <option value="richtextarea">富文本</option>\n                                                    <option value="number">数字</option>\n                                                    <option value="datetime">日期时间</option>\n                                                    <option value="currency">货币</option>\n                                                    <option value="enum">枚举</option>\n                                                    <option value="template">自定义模板</option>\n                                                </select>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'number\'">\n                                                <label>保留小数位数</label>\n                                                <input type="number" ng-model="column.fractionSize" class="form-control"/>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'datetime\'">\n                                                <label>格式化</label>\n                                                <input type="text" ng-model="column.datetimeformat" class="form-control"/>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'datetime\'">\n                                                <label>最小视图</label>\n                                                <select ng-model="column.datetimeminView" class="form-control">\n                                                    <option value="minute">minute</option>\n                                                    <option value="hour">hour</option>\n                                                    <option value="day">day</option>\n                                                    <option value="month">month</option>\n                                                    <option value="year">year</option>\n                                                </select>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'datetime\'">\n                                                <label>起始视图</label>\n                                                <select ng-model="column.datetimestartView" class="form-control">\n                                                    <option value="minute">minute</option>\n                                                    <option value="hour">hour</option>\n                                                    <option value="day">day</option>\n                                                    <option value="month">month</option>\n                                                    <option value="year">year</option>\n                                                </select>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'enum\'">\n                                                <label>枚举内容</label>\n\n                                                <div ng-init="column.options= !column.options ? []:column.options">\n                                                    <table>\n                                                        <tr ng-repeat="option in column.options">\n                                                            <td><input type="text" ng-model="option.label" class="form-control"/></td>\n                                                            <td><input type="text" ng-model="option.value" class="form-control"/></td>\n                                                        </tr>\n                                                    </table>\n                                                    <a ng-click="column.options.push({label:\'\',value:\'\'})">添加</a>\n                                                </div>\n                                            </div>\n                                            <div class="form-group" ng-show="column.type==\'template\'">\n                                                <label>模板内容</label>\n                                                <textarea ng-model="column.formater" class="form-control"></textarea>\n                                            </div>\n                                            <div class="form-group">\n                                                <label>绑定字段</label>\n\n                                                <div>\n                                                    <select ng-model="column.column_name" ng-options="key as key for (key,val) in datasources | getchild:{name:config.datasource}:\'configs\' | getchild:{name:config.table}:\'fields\'" class="form-control"></select>\n                                                    <label><input type="checkbox" ng-model="column.isfilter"/>筛选</label>\n                                                    <label><input type="checkbox" ng-model="column.isorderby"/>排序</label>\n                                                    <label><input type="checkbox" ng-model="column.isedit"/>修改</label>\n                                                </div>\n                                            </div>\n\n                                            <div class="pull-right">\n                                                <a ng-click="config.columns.splice($index,1)" class="btn btn-link text-danger">删除</a>\n                                                <a ng-click="editing=false" class="btn btn-success">完成</a>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class="media-right">\n                                        <a href ng-click="config.columns.splice($index,1)" ng-hide="editing==true"><i class="fa fa-close"></i></a>\n                                    </div>\n                                </div>\n\n                            </div>\n                            <a class="list-group-item" ng-click="config.columns.push({display:true,displayname:\'列名\',formater:\'\'})"><i class="fa fa-plus"></i> 添加列</a>\n                        </div>\n                    </div>\n                </uib-tab>\n                <uib-tab index="1">\n                    <uib-tab-heading>\n                        筛选\n                    </uib-tab-heading>\n                    <div style=" overflow: auto;">\n                        <table>\n                            <tr ng-repeat="item in config.condition">\n                                <td>\n                                    <select ng-model="item.name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isfilter:true}" class="form-control"></select>\n                                </td>\n                                <td>\n                                    <select ng-model="item.opt" class="form-control">\n                                        <option value="=">=</option>\n                                        <option value="&lt;&gt;">&lt;&gt;</option>\n                                        <option value="&lt;">&lt;</option>\n                                        <option value=">&lt;=">&lt;=</option>\n                                        <option value="&gt;">&gt;</option>\n                                        <option value="&gt;=">&gt;=</option>\n                                        <option value="like">like</option>\n                                        <option value="not like">not like</option>\n                                        <option value="begin with">begin with</option>\n                                        <option value="end with">end with</option>\n                                        <option value="is null">is null</option>\n                                        <option value="is not null">is not null</option>\n                                    </select>\n                                </td>\n                                <td>\n                                    <input ng-model="item.value" ng-if="!getcolumn(item.name).isenum" class="form-control" ng-if="item.opt != \'is null\' && item.opt != \'is not null\'"/>\n                                    <select ng-model="item.value" ng-if="getcolumn(item.name).isenum && getcolumn(item.name).options && getcolumn(item.name).options.length>0"\n                                            ng-options="option.value as option.label for option in getcolumn(item.name).options" class="form-control"></select>\n\n                                </td>\n                                <td><a ng-click="config.condition.splice($index,1)">删除</a></td>\n                            </tr>\n                        </table>\n                        <a ng-click="config.condition.push({name:\'\',opt:\'=\',value:\'\'})">添加</a>\n                    </div>\n                </uib-tab>\n                <uib-tab index="2">\n                    <uib-tab-heading>\n                        排序\n                    </uib-tab-heading>\n                    <div style="overflow: auto;">\n                        <table>\n                            <tr ng-repeat="item in config.orderby">\n                                <td>\n                                    <select ng-model="item.column_name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isorderby:true}" class="form-control"></select>\n                                </td>\n                                <td>\n                                    <a ng-click="item.order = item.order==\'ASC\' ? \'DESC\' : \'ASC\'">{{item.order}}</a>\n                                </td>\n                                <td><a ng-click="config.orderby.splice($index,1)">删除</a></td>\n                            </tr>\n                        </table>\n                        <a ng-click="config.orderby.push({column_name:\'\',order:\'ASC\'})">添加</a>\n                    </div>\n                </uib-tab>\n            </uib-tabset>\n        </div>\n    </div>\n</div>\n            ',
        replace: true,
        scope: {
            config: "=",
            datasources: "=",
            loaddata: "&",
            utility: "="
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


app.directive('datatable', function () {
    return {
        restrict: 'E',
        template: '<div cg-busy="{promise:myPromise}">\n    <div ng-if="config.type===\'list\'">\n        <div style="background-color: #ffffff; border: solid 1px #adadad; padding: 10px;margin-bottom: 10px;border-radius:4px;box-shadow: 2px 2px 3px #cccccc;" ng-show="showsearchpanel">\n            <button type="button" class="close" aria-label="Close" ng-click="showsearchpanel=false"><span aria-hidden="true">&times;</span></button>\n            <div style="">\n                <table>\n                    <tr ng-repeat="item in config.condition">\n                        <td>\n                            <select ng-model="item.name" ng-options="column.column_name as column.displayname for column in  config.columns  | filter:{isfilter:true}" class="form-control"></select>\n                        </td>\n                        <td>\n                            <select ng-model="item.opt" class="form-control">\n                                <option value="=">=</option>\n                                <option value="&lt;&gt;">&lt;&gt;</option>\n                                <option value="&lt;">&lt;</option>\n                                <option value=">&lt;=">&lt;=</option>\n                                <option value="&gt;">&gt;</option>\n                                <option value="&gt;=">&gt;=</option>\n                                <option value="like">like</option>\n                                <option value="not like">not like</option>\n                                <option value="begin with">begin with</option>\n                                <option value="end with">end with</option>\n                                <option value="is null">is null</option>\n                                <option value="is not null">is not null</option>\n                            </select>\n                        </td>\n                        <td>\n                            <input ng-model="item.value" ng-if="!getcolumn(item.name).isenum" class="form-control" ng-if="item.opt != \'is null\' && item.opt != \'is not null\'"/>\n                            <select ng-model="item.value" ng-if="getcolumn(item.name).isenum && getcolumn(item.name).options && getcolumn(item.name).options.length>0"\n                                    ng-options="option.value as option.label for option in getcolumn(item.name).options" class="form-control"></select>\n\n                        </td>\n                        <td><a ng-click="config.condition.splice($index,1)"><i class="fa fa-close"></i></a></td>\n                    </tr>\n                </table>\n                <a ng-click="config.condition.push({name:\'\',opt:\'=\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\n            </div>\n        </div>\n        <div ng-show="!showsearchpanel" style="margin-bottom: 10px;" class="clearfix">\n            <div class="pull-left">\n                <div ng-repeat="item in config.condition" class="label label-default gray-bg" style="margin-right: 5px">\n                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="getcolumn(item.name).displayname" class="text-warning"></span>\n                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.opt" class=""></span>\n                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.value | enum:getcolumn(item.name).options" class="text-primary"></span>\n                    <span ng-click="config.condition.splice($index,1);"><i class="fa fa-close"></i></span>\n                </div>\n            </div>\n            <div class="pull-right">\n                <a class="btn btn-default btn-sm" uib-popover-template="templateUrl" popover-title="" popover-trigger="\'outsideClick\'" popover-placement="bottom"><i class="fa fa-list-ul"></i></a>\n                <script type="text/ng-template" id="myPopoverTemplate.html" ng-init="templateUrl=\'myPopoverTemplate.html\'">\n                    <div ui-sortable ng-model="config.columns">\n                        <div ng-repeat="column in config.columns">\n                            <label>\n                                <input type="checkbox" ng-model="column.display" ng-click="configchanged()"/>\n                                {{column.displayname}}\n                            </label>\n                        </div>\n                    </div>\n                </script>\n                <a class="btn btn-default btn-sm" ng-click="showsearchpanel=!showsearchpanel"><i class="fa fa-search"></i></a>\n            </div>\n        </div>\n        <div class="table-responsive">\n            <table class="table table-striped table-hover table-bordered">\n                <thead>\n                <tr>\n                    <th ng-repeat="column in config.columns" ng-if="column.display==true"\n                        ng-click="sorting(column.column_name)"\n                            >\n                        {{column.displayname}}\n                        <i class="fa fa-fw fa-sort text-muted" ng-show="column.isorderby && getmodelinarray(config.orderby, \'column_name\', column.column_name)==null"></i>\n                        <i class="fa fa-fw fa-sort-asc text-info-dker" ng-show="getmodelinarray(config.orderby, \'column_name\', column.column_name)!=null && getmodelinarray(config.orderby, \'column_name\', column.column_name).order == \'ASC\'"></i>\n                        <i class="fa fa-fw fa-sort-desc text-info-dker" ng-show="getmodelinarray(config.orderby, \'column_name\', column.column_name)!=null && getmodelinarray(config.orderby, \'column_name\', column.column_name).order == \'DESC\'"></i>\n                    </th>\n                </tr>\n                </thead>\n                <tr ng-repeat="row in data.data[config.table].data" ng-dblclick="showdetail(row)">\n                    <td ng-repeat="column in config.columns"\n                        ng-if="column.display==true" \n                        ng-style="{\'text-align\' : column.align}"\n                    >\n                        <!--ng-click="showeditor(row, column);"-->\n                        <!--<span ng-hide="editingcell.row==row && editingcell.column==column">-->\n                         \n                        <div ng-if="column.isedit" uib-popover-template="\'datatable_cell_editor.html\'" popover-trigger="\'outsideClick\'"\n                             popover-placement="top" popover-append-to-body="true" popover-animation="false"  popover-class="increase-popover-width"\n                             class="block ">\n                            <span class="border-bottom-dotted" ng-if="!column.type || column.type==\'template\'" bind-html-compile="column.formater"></span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'datetime\'">{{row[column.column_name] | datetime:column.datetimeformat}}</span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'text\'">{{row[column.column_name]}}</span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'textarea\'">{{row[column.column_name]}}</span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'enum\'">{{row[column.column_name] | enum:column.options}}</span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'number\'">{{row[column.column_name] | number:column.fractionSize}}</span>\n                            <span class="border-bottom-dotted" ng-if="column.type==\'currency\'">{{row[column.column_name] | currency:"￥"}}</span>\n                            <span class="border-bottom-dotted" ng-if="row[column.column_name].length==0">&nbsp;</span>\n                        </div>\n                        <div ng-if="!column.isedit">\n                            <span class="block" ng-if="!column.type || column.type==\'template\'" bind-html-compile="column.formater"></span>\n                            <span class="block" ng-if="column.type==\'datetime\'">{{row[column.column_name] | datetime:column.datetimeformat}}</span>\n                            <span class="block" ng-if="column.type==\'text\'">{{row[column.column_name]}}</span>\n                            <span class="block" ng-if="column.type==\'textarea\'">{{row[column.column_name]}}</span>\n                            <span class="block" ng-if="column.type==\'enum\'">{{row[column.column_name] | enum:column.options}}</span>\n                            <span class="block" ng-if="column.type==\'number\'">{{row[column.column_name] | number:column.fractionSize}}</span>\n                            <span class="block" ng-if="column.type==\'currency\'">{{row[column.column_name] | currency:"￥"}}</span>\n                        </div>\n                        <!--</span>-->\n                        <!--<span ng-show="editingcell.row==row && editingcell.column==column">-->\n                            <!--<input type="text" class="form-control" ng-model="row[column.column_name]"> -->\n                        <!--</span>-->\n                    </td>\n                </tr>\n            </table>\n        </div>\n        <footer class="">\n            <div class="row">\n                <div class="col-sm-4 text-left">\n                    <small class="text-muted inline m-t-sm m-b-sm"> {{"总条数" | translate}}: {{totalItems}}</small>\n                </div>\n                <div class="col-sm-8 text-right text-center-xs">\n                    <ul uib-pagination total-items="totalItems" items-per-page="itemsPerPage"\n                        previous-text="{{\'上一页\' | translate}}" next-text="{{\'下一页\' | translate}}"\n                        first-text="{{\'首页\' | translate}}" last-text="{{\'末页\' | translate}}"\n                        ng-model="currentPage" ng-change="pageChanged(currentPage)" class="m-t-none m-b"\n                        max-size="10"\n                        boundary-links="true" rotate="false"></ul>\n                </div>\n            </div>\n        </footer>\n    </div>\n    <div ng-if="config.type===\'detail\'">\n        <div ng-repeat="row in data.data[config.table].data">\n            <table class="table table-striped table-hover table-bordered">\n                <tr ng-repeat="column in config.columns">\n                    <th ng-bind="column.displayname" class="text-nowrap">\n                    </th>\n                    <td bind-html-compile="column.formater" ng-click="showeditor(row, column)">\n                    </td>\n                </tr>\n            </table>\n        </div>\n    </div>\n</div>\n            ',
        replace: true,
        scope: {
            config: "=",
            datasource: "=",
            variables: "=",
            loaddata: "&", // 数据查询
            ondataupdate: "&", // 数据更新
            utility: "="
            //onLoadCallback : "&"
        },
        controller: function ($scope, $resource, $uibModal, $location, $interpolate, $q, $templateCache) {

            // 系统变量
            // $scope.Variables = $scope.variables;
            $scope.currentPage = 1;
            $scope.editingcell = {};

            $templateCache.put('datatable_cell_editor.html',
                '<datatable-cell-editor></datatable-cell-editor>'
            );
            //$scope.
//'<div class="modal-header">\n    <h3 class="modal-title">\n        修改</h3>\n</div>\n<div class="modal-body">\n    <div>\n        <div ng-bind="column.displayname" class="text-nowrap">\n        </div>\n        <div ng-show="!column.type || column.type==\'text\' || column.type==\'number\' || column.type==\'currency\'">\n            <input ng-model="row[column.column_name]" class="form-control"/>\n        </div>\n        <div ng-show="column.type==\'enum\'">\n            <select class="form-control" ng-model="row[column.column_name]">\n                <option ng-repeat="opt in column.options" value="{{opt.value}}" ng-bind="opt.label"></option>\n            </select>\n        </div>\n        <div ng-show="column.type==\'datetime\'">\n            <!--<div class="dropdown">-->\n                <!--<a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" href>-->\n                    <!--<div class="input-group">-->\n                        <!--<input type="text" class="form-control" data-ng-model="row[column.column_name]">-->\n                        <!--<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>-->\n                    <!--</div>-->\n                <!--</a>-->\n                <!--<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">-->\n                    <!--<datetimepicker data-ng-model="row[column.column_name]" data-datetimepicker-config="{ dropdownSelector: \'#dropdown2\', modelType:\'milliseconds\' }"/>-->\n                <!--</ul>-->\n            <!--</div>-->\n            <datetimepicker data-ng-model="row[column.column_name]"\n                            data-datetimepicker-config="{ startView:column.datetimestartView?column.datetimestartView:\'day\', minView:column.datetimeminView?column.datetimeminView:\'day\',modelType:\'milliseconds\' }" />\n            <input type="text" ng-model="row[column.column_name]" class="form-control"/>\n        </div>\n\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-success" type="button" ng-click="ok()">修改并保存</button>\n    <button class="btn btn-default" type="button" ng-click="cancel()">取消</button>\n</div>\n'
            $scope.$on("datasource.reload", function (event, data) {
                if (data.datasourcename == $scope.config.datasource) {
                    $scope.getdata($scope.page);
                }
            });
            // 查询数据
            $scope.getdata = function (page) {
                var delay = $q.defer();

                page = !page ? 1 : parseInt(page);
                $scope.itemsPerPage = !$scope.itemsPerPage ? $scope.config.pagesize : $scope.itemsPerPage;
                var limit = [(page - 1) * $scope.itemsPerPage, $scope.itemsPerPage];
                var config = {};
                config[$scope.config.table] = {};
                config[$scope.config.table].limit = limit;

                // 查询条件
                if ($scope.config.condition) {
                    config[$scope.config.table].condition = angular.copy($scope.config.condition);
                }
                // 排序
                if ($scope.config.orderby) {
                    var sort = [];
                    for (var i = 0; i < $scope.config.orderby.length; i++) {
                        sort.push({
                            name: $scope.config.orderby[i].column_name,
                            sort: $scope.config.orderby[i].order == 'DESC' ? '-1' : '1'
                        });
                    }
                    config[$scope.config.table].sort = sort;
                }

                $scope.myPromise = $scope.utility.datasource.execute($scope.config.datasource, config)
                    .then(function (data) {
                        $scope.data = data;

                        $scope.totalItems = data.data[$scope.config.table].totalItems;
                        $scope.page = $scope.currentPage = page;
                        // $scope.itemsPerPage = data.data.itemsPerPage;

                        $scope.pageChanged = function (currentPage) {
                            console.log(currentPage)
                            $scope.getdata(currentPage);
                        };
                        delay.resolve(data);
                    }, function (res) {
                        delay.reject(res);
                    });
                return delay.promise;
            };

            // 监视配置变化并重新查询
            $scope.$watch(function () {
                return $scope.config.connectid +
                    $scope.config.database +
                    $scope.config.table +
                    JSON.stringify($scope.config.condition) +
                    JSON.stringify($scope.config.orderby);
            }, function () {
                $scope.getdata($scope.page);
            }, true);

            // 获取列信息
            $scope.getcolumn = function (column_name) {
                for (var i = 0; i < $scope.config.columns.length; i++) {
                    if ($scope.config.columns[i].column_name == column_name) {
                        return $scope.config.columns[i];
                    }
                }
                return null;
            }
            $scope.join = function (value, tablename, columnname, displaycolumnname) {
                // var out = value;
                if ($scope.data.data[tablename] && $scope.data.data[tablename].data) {
                    for (var i = 0; i < $scope.data.data[tablename].data.length; i++) {
                        if ($scope.data.data[tablename].data[i][columnname] == value) {
                            return $scope.data.data[tablename].data[i][displaycolumnname];
                        }
                    }
                }
                return value;
            }

            // 获取排序对象
            $scope.getorderby = function (column_name) {
                for (var i = 0; i < $scope.config.orderby.length; i++) {
                    if ($scope.config.orderby[i].column_name == column_name) {
                        return $scope.config.orderby[i];
                    }
                }
                return null;
            }
            // 排序
            $scope.sorting = function (column_name) {
                var column = $scope.getcolumn(column_name);
                if (column && column.isorderby) {
                    var orderby = $scope.getorderby(column_name);
                    var order = "ASC";
                    if (orderby != null) {
                        order = orderby.order == "ASC" ? "DESC" : "ASC";
                    }
                    $scope.config.orderby = [
                        {
                            "column_name": column_name,
                            "order": order
                        }
                    ];
//                    $scope.getdata($scope.currentPage);
//                    $scope.configchanged();
                }
            };

            $scope.showeditor = function (row, column) {
                if (column.isedit) {
//                    alert(row[column.column_name]);

                    //$scope.editingcell={
                    //    row:row,
                    //    column:column
                    //}

                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: '<div class="modal-header">\n    <h3 class="modal-title">\n        修改</h3>\n</div>\n<div class="modal-body">\n    <div>\n        <div ng-bind="column.displayname" class="text-nowrap">\n        </div>\n        <div ng-show="!column.type || column.type==\'text\' || column.type==\'number\' || column.type==\'currency\'">\n            <input ng-model="row[column.column_name]" class="form-control"/>\n        </div>\n        <div ng-show="column.type==\'enum\'">\n            <select class="form-control" ng-model="row[column.column_name]">\n                <option ng-repeat="opt in column.options" value="{{opt.value}}" ng-bind="opt.label"></option>\n            </select>\n        </div>\n        <div ng-show="column.type==\'datetime\'">\n            <!--<div class="dropdown">-->\n                <!--<a class="dropdown-toggle" id="dropdown2" role="button" data-toggle="dropdown" href>-->\n                    <!--<div class="input-group">-->\n                        <!--<input type="text" class="form-control" data-ng-model="row[column.column_name]">-->\n                        <!--<span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>-->\n                    <!--</div>-->\n                <!--</a>-->\n                <!--<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel">-->\n                    <!--<datetimepicker data-ng-model="row[column.column_name]" data-datetimepicker-config="{ dropdownSelector: \'#dropdown2\', modelType:\'milliseconds\' }"/>-->\n                <!--</ul>-->\n            <!--</div>-->\n            <datetimepicker data-ng-model="row[column.column_name]"\n                            data-datetimepicker-config="{ startView:column.datetimestartView?column.datetimestartView:\'day\', minView:column.datetimeminView?column.datetimeminView:\'day\',modelType:\'milliseconds\' }" />\n            <input type="text" ng-model="row[column.column_name]" class="form-control"/>\n        </div>\n\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-success" type="button" ng-click="ok()">修改并保存</button>\n    <button class="btn btn-default" type="button" ng-click="cancel()">取消</button>\n</div>\n',
                        //                    templateUrl: '/areas/enter/content/query/detail.html',
                        controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, data) {
                            $scope.row = angular.copy(data.row);
                            $scope.column = data.column;
                            $scope.ok = function () {
                                $uibModalInstance.close({
                                    row: $scope.row,
                                    column: $scope.column
                                });
                            };

                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        },
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    row: row,
                                    column: column
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (data) {
                        // 保存数据操作
                        var oldvalue = row[column.column_name];
                        var newvalue = data.row[column.column_name];
                        if (oldvalue != newvalue) {
                            // 更新数据
                            console.log('更新数据', oldvalue, newvalue);
                            var condition = {};
                            // 获取数据的主键列
                            var ds = $scope.data.data[$scope.config.table];
                            for (var i = 0; i < ds.columns.length; i++) {
                                if (ds.columns[i].key == true) {
                                    condition[ds.columns[i].name] = row[ds.columns[i].name]
                                }
                            }

                            var modify = {};
                            modify[column.column_name] = newvalue
                            $scope.dataupdate(modify, condition);

                            // $scope.updatedata($scope.config.connectid, $scope.config.database, $scope.config.table, condition, [
                            //     {
                            //         "name": column.column_name,
                            //         "value": newvalue
                            //     }
                            // ]);
                        }

//                        alert(data.row)
//                        alert(data.column)
//                        $ctrl.selected = row;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });
                }
            };

            // 从数组中获取符合条件的对象
            $scope.getmodelinarray = function (array, key, value) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i][key] === value) {
                        return array[i];
                    }
                }
                return null;
            }

            // 显示详情
            $scope.showdetail = function (data) {
                var $ctrl = this;
                var modalInstance = $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    template: '<div class="modal-header">\
    <h3 class="modal-title">\
        详情</h3>\
</div>\
<div class="modal-body">\
    <div>\
        <table class="table table-striped table-hover table-bordered">\
            <tr ng-repeat="column in config.columns">\
                <th ng-bind="column.displayname" class="text-nowrap">\
                </th>\
                <td bind-html-compile="column.formater">\
                </td>\
            </tr>\
        </table>\
    </div>\
</div>\
',
//                    templateUrl: '/areas/enter/content/query/detail.html',
                    controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, data) {
                        var $ctrl = this;
                        $ctrl.data = data.data;
                        $scope.row = data.data;
                        $scope.config = data.config;

                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        data: function () {
                            return {
                                config: $scope.config,
                                data: data
                            };
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $ctrl.selected = selectedItem;
                }, function () {
                    //$log.info('Modal dismissed at: ' + new Date());
                });
            }

            $scope.dataupdate = function (modifier, condition) {
                $scope.utility.updatedata($scope.config.datasource, $scope.config.table, condition, modifier)
                //$scope.ondataupdate({config: params})
                    .then(function (data) {
                        $scope.getdata($scope.page);
                    }, function (resp) {
                        alert(resp);
                    })
            }
        }
    };
});


app.directive('datatableCellEditor', function () {
    return {
        restrict: 'E',
        template: '<div>\n    <div ng-if="!column.type || column.type==\'text\' || column.type==\'number\' || column.type==\'currency\' || column.type==\'template\'" class="form-inline">\n        <input ng-model="newrow[column.column_name]" class="form-control"/>\n        <button class="btn btn-success" type="button" ng-click="save()">更新</button>\n    </div>\n    <div ng-if="column.type==\'textarea\'">\n        <textarea ng-model="newrow[column.column_name]" class="form-control" rows="5"></textarea>\n        <button class="btn btn-success pull-right m-t-xs m-b-xs" type="button" ng-click="save()">更新</button>\n    </div>\n    <div ng-if="column.type==\'enum\'" class="form-inline">\n        <select class="form-control" ng-model="newrow[column.column_name]">\n            <option ng-repeat="opt in column.options" value="{{opt.value}}" ng-bind="opt.label"></option>\n        </select>\n        <button class="btn btn-success" type="button" ng-click="save()">更新</button>\n    </div>\n    <div ng-if="column.type==\'datetime\'">\n\n        <datetimepicker data-ng-model="newrow[column.column_name]"\n                        data-datetimepicker-config="{ startView:column.datetimestartView?column.datetimestartView:\'day\', minView:column.datetimeminView?column.datetimeminView:\'day\',modelType:\'milliseconds\' }"/>\n        <!--<input type="text" ng-model="newrow[column.column_name]" class="form-control"/>-->\n        <div class="form-inline">\n            <input type="text" class="form-control" value="{{newrow[column.column_name] | datetime:column.datetimeformat}}" readonly/>\n            <button class="btn btn-success" type="button" ng-click="save()">更新</button>\n        </div>\n    </div>\n\n</div>\n',
        replace: true,
        // scope: {
        //     row: "@",
        //     columns:"@",
        //     column: "@",
        //     utility:"="
        // },
        controller: function ($scope) {
            $scope.newrow = angular.copy($scope.row);
            $scope.save = function () {
                var oldvalue = $scope.row[$scope.column.column_name];
                var newvalue = $scope.newrow[$scope.column.column_name];
                if (oldvalue != newvalue) {
                    var condition = {};
                    // 获取数据的主键列
                    var ds = $scope.data.data[$scope.config.table];
                    for (var i = 0; i < ds.columns.length; i++) {
                        if (ds.columns[i].key == true) {
                            condition[ds.columns[i].name] = $scope.row[ds.columns[i].name]
                        }
                    }

                    var modify = {};
                    modify[$scope.column.column_name] = newvalue;

                    $scope.utility.updatedata($scope.config.datasource, $scope.config.table, condition, modify)
                    //$scope.ondataupdate({config: params})
                        .then(function (data) {
                            $scope.getdata($scope.page);
                        }, function (resp) {
                            alert(resp);
                        })
                }
            }
        }
    };
});