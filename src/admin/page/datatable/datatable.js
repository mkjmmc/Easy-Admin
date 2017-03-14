'use strict';
app.directive('datatableconfig', function() {
    return {
        restrict: 'E',
        template: '<div>\
        <div class="row">\
                <div class="col-xs-3">\
                    <div>\
                        <select ng-model="config.connectid" ng-options="connect.ID as connect.Name for connect in connects" class="form-control">\
                        </select>\
                        <select ng-model="config.database" ng-options="tablename for tablename in databases" class="form-control">\
                        </select>\
                        <select ng-model="config.table" ng-options="tablename for tablename in tablelist" class="form-control">\
                        </select>\
                    </div>\
                    <div class="list-group" style=" overflow: auto">\
                        <a ng-repeat="column in columnlist" class="list-group-item" ng-click="config.columns.push({display:true,displayname:column.column_name,column_name:column.column_name,formater:\'\\{\\{row.\'+column.column_name+\'\\}\\}\'})">\
                            <span class="badge">{{column.data_type}}</span> {{column.column_name}}\
                        </a>\
                    </div>\
                </div>\
                <div class="col-xs-9">\
                    <uib-tabset active="active">\
                <uib-tab index="0">\
                    <uib-tab-heading>显示\
                    </uib-tab-heading>\
                    <div style="overflow: auto;">\
                        <div class="form-inline">名称：<input type="text" ng-model="config.title" class="form-control"/>\
                        类型： <select ng-model="config.type" class="form-control">\
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
                                    <select ng-model="column.column_name" ng-options="column.column_name as column.column_name for column in columnlist" class="form-control"></select>\
                                </td>\
                                <td>\
                                    <div ng-if="column.column_name && column.column_name.length>0">\
                                        <label><input type="checkbox" ng-model="column.isfilter"/>可筛选</label>\
                                        <label><input type="checkbox" ng-model="column.isorderby"/>可排序</label>\
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
                            <tr ng-repeat="item in config.filter">\
                                <td>\
                                    <select ng-model="item.column_name" ng-options="column.column_name as column.displayname for column in config.columns  | objFilter:{isfilter:true}" class="form-control"></select>\
                                </td>\
                                <td>\
                                    <select ng-model="item.opt" class="form-control">\
                                        <option value="等于">等于</option>\
                                        <option value="不等于">不等于</option>\
                                        <option value="小于">小于</option>\
                                        <option value="小于或等于">小于或等于</option>\
                                        <option value="大于">大于</option>\
                                        <option value="大于或等于">大于或等于</option>\
                                        <option value="包含">包含</option>\
                                        <option value="不包含">不包含</option>\
                                        <option value="开始以">开始以</option>\
                                        <option value="结束以">结束以</option>\
                                        <option value="是空的">是空的</option>\
                                        <option value="不是空的">不是空的</option>\
                                    </select>\
                                </td>\
                                <td>\
                                    <input ng-model="item.value" ng-if="!getcolumn(item.column_name).isenum" class="form-control" ng-if="item.opt != \'是空的\' && item.opt != \'不是空的\'"/>\
                                    <select ng-model="item.value" ng-if="getcolumn(item.column_name).isenum && getcolumn(item.column_name).options && getcolumn(item.column_name).options.length>0"\
                                        ng-options="option.value as option.label for option in getcolumn(item.column_name).options" class="form-control"></select>\
                                        \
                                </td>\
                                <td><a ng-click="config.filter.splice($index,1)">删除</a></td>\
                            </tr>\
                        </table>\
                        <a ng-click="config.filter.push({column_name:\'\',opt:\'等于\',value:\'\'})">添加</a>\
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
            <datatable config="config"></datatable>\
            </div>\
            ',
        replace: true,
        scope: {
            config: "="
        },
        controller: function ($scope, $resource, $uibModal, $timeout) {

            $scope.connects = [];
            $scope.databases = [];
            $scope.tablelist = [];
            $scope.columnlist = [];
            $scope.data = null;
            $scope.defaultconfig = {
                "connectid": 1,
                "database": "",
                "title": "查询",
                "table": "gf_kecheng",
                "columns": [],
                "filter": [],
                "orderby": [],
                "page": 1,
                "pagesize": 20
            };

            // 配置初始化
            $scope.config = angular.extend($scope.config, angular.extend($scope.defaultconfig, $scope.config));


            // 初始化数据库
            $scope.initdatabase = function() {
                // 监控表的变化刷新列信息
                // 连接变化
                $scope.$watch(function() {
                    return $scope.config.connectid;
                }, function(newValue, oldValue) {
                    $scope.getdatabases();
                });
                // 数据库变化
                $scope.$watch(function() {
                    return $scope.config.database;
                }, function(newValue, oldValue) {
                    $scope.gettablelist();
                });
                $scope.$watch(function() {
                    return $scope.config.table;
                }, function(newValue, oldValue) {
                    $scope.getcolumnlist();
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
                $com.get({ connectid: $scope.config.connectid }, function(data) {
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
            $scope.gettablelist = function() {
                var $com = $resource('/enter/query/TableList');
                $com.query({
                    connectid: $scope.config.connectid,
                    databasename: $scope.config.database
                }, function(data) {
                    // alert(data);
                    // 显示数据
                    $scope.tablelist = data;
                }, function(resp) {
                    console.log("tablelist error", resp);
                });
            }
            //$scope.gettablelist();

            // 获取表所有的列
            $scope.getcolumnlist = function() {
                var $com = $resource('/enter/query/columnList');
                $com.query({
                    connectid: $scope.config.connectid,
                    databasename: $scope.config.database,
                    tablename: $scope.config.table
                }, function(data) {
                    // alert(data);
                    // 显示数据
                    $scope.columnlist = data;
                }, function(resp) {
                    console.log("columnlist error", resp);
                });
            }

            // 延时查询数据库信息
            $timeout(function() {
                $scope.initdatabase();
            }, 1000);
            

            // $scope.getdata($stateParams.page, $stateParams.search);

            $scope.selectall = function(selected, datalist, name) {
                for (var i = 0; i < datalist.length; i++) {
                    datalist[i][name] = selected;
                }
            }

            $scope.getcolumn = function(column_name) {
                for (var i = 0; i < $scope.config.columns.length; i++) {
                    if ($scope.config.columns[i].column_name == column_name) {
                        return $scope.config.columns[i];
                    }
                }
                return null;
            }

            $scope.getdisplayname = function(column_name) {
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
 


app.directive('datatable', function() {
    return {
        restrict: 'E',
        template: '\
<div>\
    <div ng-if="config.type===\'list\'">\
        <div style="background-color: #ffffff; border: solid 1px #adadad; padding: 10px;margin-bottom: 10px;border-radius:4px;box-shadow: 2px 2px 3px #cccccc;" ng-show="showsearchpanel">\
            <button type="button" class="close" aria-label="Close" ng-click="showsearchpanel=false"><span aria-hidden="true">&times;</span></button>\
            <div style="">\
                <table>\
                    <tr ng-repeat="item in config.filter">\
                        <td>\
                            <select ng-model="item.column_name" ng-options="column.column_name as column.displayname for column in  config.columns  | filter:{isfilter:true}" class="form-control"></select>\
                        </td>\
                        <td>\
                            <select ng-model="item.opt" class="form-control">\
                                <option value="等于">等于</option>\
                                <option value="不等于">不等于</option>\
                                <option value="小于">小于</option>\
                                <option value="小于或等于">小于或等于</option>\
                                <option value="大于">大于</option>\
                                <option value="大于或等于">大于或等于</option>\
                                <option value="包含">包含</option>\
                                <option value="不包含">不包含</option>\
                                <option value="开始以">开始以</option>\
                                <option value="结束以">结束以</option>\
                                <option value="是空的">是空的</option>\
                                <option value="不是空的">不是空的</option>\
                            </select>\
                        </td>\
                        <td>\
                            <input ng-model="item.value" ng-if="!getcolumn(item.column_name).isenum" class="form-control" ng-if="item.opt != \'是空的\' && item.opt != \'不是空的\'"/>\
                            <select ng-model="item.value" ng-if="getcolumn(item.column_name).isenum && getcolumn(item.column_name).options && getcolumn(item.column_name).options.length>0"\
                                ng-options="option.value as option.label for option in getcolumn(item.column_name).options" class="form-control"></select>\
                                \
                        </td>\
                        <td><a ng-click="config.filter.splice($index,1)"><i class="fa fa-close"></i></a></td>\
                    </tr>\
                </table>\
                <a ng-click="config.filter.push({column:\'\',opt:\'等于\',value:\'\'})" class="btn btn-default"><i class="fa fa-plus"></i></a>\
            </div>\
        </div>\
        <div ng-show="!showsearchpanel" style="margin-bottom: 10px;">\
            <div ng-repeat="item in config.filter" class="label label-default gray-bg" style="margin-right: 5px">\
                <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="getcolumn(item.column_name).displayname" class="text-warning"></span>\
                <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.opt" class=""></span>\
                <span ng-click="$parent.showsearchpanel=!$parent.showsearchpanel" ng-bind="item.value | enum:getcolumn(item.column_name).options" class="text-primary"></span>\
                <span ng-click="config.filter.splice($index,1);"><i class="fa fa-close"></i></span>\
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
                <tr ng-repeat="row in data.data" ng-dblclick="showdetail(row)">\
                    <td ng-repeat="column in config.columns" ng-if="column.display==true" ng-style="{\'text-align\' : column.align}">\
                        <span bind-html-compile="column.formater"></span>\
                    </td>\
                </tr>\
            </table>\
        </div>\
        <footer class="">\
            <div class="row">\
                <div class="col-sm-4 text-left">\
                    <small class="text-muted inline m-t-sm m-b-sm"> {{"总条数" | translate}}: {{data.totalItems}}</small>\
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
        <div ng-repeat="row in data.data">\
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
</div>\
            ',
        replace: true,
        scope: {
            config: "="
        },
        controller: function ($scope, $resource, $uibModal) {
            $scope.currentPage = 1;

            // 查询数据
            $scope.getdata = function(page) {
                if (!$scope.config.database || $scope.config.database.length == 0 || !$scope.config.table || $scope.config.table.length == 0) {
                    return;
                }
                page = !page ? 1 : parseInt(page);
                var params = {
                    config: JSON.stringify($scope.config),
                    page: page
                }
                var $com = $resource('/enter/query/query');
                $com.save(null, params, function(data) {
                    if (data.result == 0) {
                        // alert(data);
                        // 显示数据
                        $scope.data = data.data;

                        $scope.totalItems = data.data.totalItems;
                        $scope.currentPage = data.data.currentPage;
                        $scope.itemsPerPage = data.data.itemsPerPage;

                        $scope.pageChanged = function (currentPage) {
//                $scope.urlparms.page = $scope.currentPage;
//                $location.search($scope.urlparms);
                            //                        $log.log('Page changed to: ' + $scope.currentPage);
//                            $state.transitionTo('query.query', {
//                                search: $scope.search_context,
//                                page: $scope.currentPage,
//                                id: $stateParams.id,
//                                config: LZString.compressToBase64(JSON.stringify($scope.paramconfig))
//                            },
//                            {
//                                location: true, // This makes it update URL
//                                inherit: true,
//                                relative: $state.$current,
//                                notify: false // This makes it not reload
                            //                            });
                            console.log(currentPage)
                            $scope.getdata(currentPage);
//                $scope.getdata($scope.currentPage);
                        };

                        //                    $scope.maxSize = 5;
                        //                    $scope.bigTotalItems = 175;
                        //                    $scope.bigCurrentPage = 1;
                    } else {
                        alert(data.message);
                    }
                }, function(resp) {
                    alert(resp);
                });
            }

            // 监视配置变化并重新查询
            $scope.$watch(function() {
                return $scope.config.connectid +
                $scope.config.database +
                $scope.config.table + 
                JSON.stringify($scope.config.filter) +
                JSON.stringify($scope.config.orderby);
            }, function() {
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
            $scope.sorting = function(column_name) {
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
            }

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
                    template:'<div class="modal-header">\
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
        }
    };
});
 