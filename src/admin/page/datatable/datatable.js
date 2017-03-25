'use strict';
app.directive('datatableconfig', function () {
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


app.directive('datatable', function () {
    return {
        restrict: 'E',
        template: '\
<div>\
    <div ng-if="config.type===\'list\'">\
        <div style="background-color: #ffffff; border: solid 1px #adadad; padding: 10px;margin-bottom: 10px;border-radius:4px;box-shadow: 2px 2px 3px #cccccc;" ng-show="showsearchpanel">\
            <button type="button" class="close" aria-label="Close" ng-click="showsearchpanel=false"><span aria-hidden="true">&times;</span></button>\
            <div style="">\
                <table>\
                    <tr ng-repeat="item in config.condition">\
                        <td>\
                            <select ng-model="item.name" ng-options="column.column_name as column.displayname for column in  config.columns  | filter:{isfilter:true}" class="form-control"></select>\
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
                        <td><a ng-click="config.condition.splice($index,1)"><i class="fa fa-close"></i></a></td>\
                    </tr>\
                </table>\
                <a ng-click="config.condition.push({name:\'\',opt:\'=\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\
            </div>\
        </div>\
        <div ng-show="!showsearchpanel" style="margin-bottom: 10px;">\
            <div class="pull-left">\
                <div ng-repeat="item in config.condition" class="label label-default gray-bg" style="margin-right: 5px">\
                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="getcolumn(item.name).displayname" class="text-warning"></span>\
                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.opt" class=""></span>\
                    <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.value | enum:getcolumn(item.name).options" class="text-primary"></span>\
                    <span ng-click="config.condition.splice($index,1);"><i class="fa fa-close"></i></span>\
                </div>\
            </div>\
            <div class="pull-right">\
                <a class="btn btn-default btn-sm" uib-popover-template="templateUrl" popover-title="" popover-trigger="\'outsideClick\'" popover-placement="bottom"><i class="fa fa-list-ul"></i></a>\
                <script type="text/ng-template" id="myPopoverTemplate.html" ng-init="templateUrl=\'myPopoverTemplate.html\'">\
                    <div ui-sortable ng-model="config.columns">\
                        <div ng-repeat="column in config.columns">\
                            <label>\
                                <input type="checkbox" ng-model="column.display" ng-click="configchanged()"/>\
                                {{column.displayname}}\
                            </label>\
                        </div>\
                    </div>\
                </script>\
                <a class="btn btn-default btn-sm" ng-click="showsearchpanel=!showsearchpanel"><i class="fa fa-search"></i></a>\
            </div>\
        </div>\
        <div class="table-responsive">\
            <table class="table table-striped table-hover table-bordered">\
                <thead>\
                    <tr>\
                        <th ng-repeat="column in config.columns" ng-if="column.display==true" ng-class="{\
                            \'sorting\': column.isorderby\
                            ,\'sorting_asc\':getmodelinarray(config.orderby, \'column_name\', column.column_name)!=null && getmodelinarray(config.orderby, \'column_name\', column.column_name).order == \'ASC\'\
                            ,\'sorting_desc\':getmodelinarray(config.orderby, \'column_name\', column.column_name)!=null && getmodelinarray(config.orderby, \'column_name\', column.column_name).order == \'DESC\'\
                            }"\
                            ng-click="sorting(column.column_name)"\
                            >\
                            {{column.displayname}}\
                        </th>\
                    </tr>\
                </thead>\
                <tr ng-repeat="row in data.data[config.table].data" ng-dblclick="showdetail(row)">\
                    <td ng-repeat="column in config.columns" \
                        ng-if="column.display==true" ng-style="{\'text-align\' : column.align}" \
                        ng-click="showeditor(row, column)"\
                        <span bind-html-compile="column.formater"></span>\
                    </td>\
                </tr>\
            </table>\
        </div>\
        <footer class="">\
            <div class="row">\
                <div class="col-sm-4 text-left">\
                    <small class="text-muted inline m-t-sm m-b-sm"> {{"总条数" | translate}}: {{totalItems}}</small>\
                </div>\
                <div class="col-sm-8 text-right text-center-xs">\
                    <ul uib-pagination total-items="totalItems" items-per-page="itemsPerPage"\
                        previous-text="{{\'上一页\' | translate}}" next-text="{{\'下一页\' | translate}}"\
                        first-text="{{\'首页\' | translate}}" last-text="{{\'末页\' | translate}}"\
                        ng-model="currentPage" ng-change="pageChanged(currentPage)" class="m-t-none m-b"\
                        max-size="10"\
                        boundary-links="true" rotate="false"></ul>\
                </div>\
            </div>\
        </footer>\
    </div>\
    <div ng-if="config.type===\'detail\'">\
        <div ng-repeat="row in data.data[config.table].data">\
            <table class="table table-striped table-hover table-bordered">\
                <tr ng-repeat="column in config.columns">\
                    <th ng-bind="column.displayname" class="text-nowrap">\
                    </th>\
                    <td bind-html-compile="column.formater" ng-click="showeditor(row, column)" >\
                    </td>\
                </tr>\
            </table>\
        </div>\
    </div>\
</div>\
            ',
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
            $scope.currentPage = 1;

            $scope.$on("datasource.reload", function (event, data) {
                if (data.datasourcename == $scope.config.datasource) {
                    $scope.getdata($scope.page);
                }
            });
            // 查询数据
            $scope.getdata = function (page) {
                page = !page ? 1 : parseInt(page);
                $scope.itemsPerPage = !$scope.itemsPerPage ? 20 : $scope.itemsPerPage;
                var limit = [(page - 1) * $scope.itemsPerPage, $scope.itemsPerPage];
                var config = {};
                config[$scope.config.table] = {};
                config[$scope.config.table].limit = limit;

                // 查询条件
                if ($scope.config.condition) {
                    config[$scope.config.table].condition = $scope.config.condition;
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

                $scope.loaddata({name: $scope.config.datasource, config: config}).then(function (data) {
                    $scope.data = data;

                    $scope.totalItems = data.data[$scope.config.table].totalItems;
                    $scope.page = $scope.currentPage = page;
                    // $scope.itemsPerPage = data.data.itemsPerPage;

                    $scope.pageChanged = function (currentPage) {
                        console.log(currentPage)
                        $scope.getdata(currentPage);
                    };
                });
            }

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

                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: '\
<div class="modal-header">\
    <h3 class="modal-title">\
        修改</h3>\
</div>\
<div class="modal-body">\
    <div>\
        <div ng-bind="column.displayname" class="text-nowrap">\
        </div>\
        <div>\
        <input ng-model="row[column.column_name]" class="form-control" />\
        </div>\
    </div>\
</div>\
<div class="modal-footer">\
    <button class="btn btn-success" type="button" ng-click="ok()">修改并保存</button>\
    <button class="btn btn-default" type="button" ng-click="cancel()">取消</button>\
</div>\
',
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
 