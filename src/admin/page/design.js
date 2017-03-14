'use strict';
angular.module('app')
    .directive('design', function () {
        return {
            restrict: 'E',
            template: '' +
            '<div class="row" ng-init="editable=true">' +
            '<div class="col-xs-12" ng-if="editable"><input type="text" ng-model="Component.name" class="form-control" /></div>' +
            '<div class=" col-xs-3" ng-if="editable">' +
            '   <div class="ibox">' +
            '       <div class="ibox-title">' +
            '           <h5>组件库</h5>' +
            '       </div>' +
            '       <div class="ibox-content">' +
            '           <div class="cell scrollable hover">' +
            '               <div class="cell-inner">' +
            '                   <div ng-sortable="sortableConfigtoolbox" class=" list-group no-radius no-border  m-b-none">' +
            '                       <div ng-repeat="item in toolbox" class=" list-group-item hover-anchor b-a no-select ng-scope  m-l-none">' +
            '                           <span ng-bind="item.name"></span>' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ibox">' +
            '       <div class="ibox-title">' +
            '           <h5>数据源</h5>' +
            '           <div class="ibox-tools"><a ng-click="Component.datasources.push({name:\'数据源\', Configs:[]})">添加</a></div>' +
            '       </div>' +
            '       <div class="ibox-content">'+
            '           <div class="list-group">'+
            '               <a ng-repeat="ds in Component.datasources" class="list-group-item" ng-click="editdatasource(ds)">'+
            '                   {{ds.name}}'+
            '                   {{ds.type}}'+
            '                   {{ds.table}}'+
            '                   {{ds.fields}}'+
            '                   {{ds.condition}}'+
            '                   {{ds.join}}'+
            '               </a>'+
            '               {{config.datasources}}'+
            '           </div>'+
            '       </div>' +
            '   </div>' +
            '</div>' +
            '<div ng-class="{\'col-xs-9\': editable,\'col-xs-12\': !editable}">' +
            '<div class="layout-container" ng-include="\'list.html\'">' +
            '</div>' +
            '</div><div ng-if="editable">{{Component}}</div>' +
            '</div>',
            replace: true,
            scope: {
                component: "=",
                editable: "="
            },
            controller: function ($scope, $templateCache, $uibModal) {

                // 加载模板
//                // 列表
//                $templateCache.put('list.html',
//                    '<div dnd-list="component.children" class="layout">' +
//                    '   <div ng-repeat="component in component.children track by $index"' +
//                    '       dnd-draggable="component"' +
//                    '       dnd-effect-allowed="move"' +
//                    '       dnd-moved="$parent.children.splice($index, 1)"' +
//                    '       dnd-selected="selecteditem = item"' +
//                    '        dnd-callback ="drop(component)"' +
//                    '       ng-class="{selected: selecteditem === item}"' +
//                    '       ng-include="component.type + \'.html\'">' +
//                    '   </div>' +
//                    '</div>'
//                );
//                // 容器
//                $templateCache.put('row.html',
//                    '<div class="row-fluid">' +
//                    '   <div ng-repeat="component in component.children"' +
//                    '       class="column">' +
//                    '       <div ng-repeat="(key,children) in component" ng-if="key == \'children\'" ng-include="\'list.html\'"></div>' +
//                    '   </div>' +
//                    '</div>'
//                );
//                // 容器
//                $templateCache.put('page.html',
//                    '<div ng-include="\'list.html\'">' +
//                    '</div>'
//                );

                // 列表
                $templateCache.put('list.html',
                    '<div ng-sortable="sortableConfig" class="layout">' +
                    '   <div ng-repeat="component in component.children"' +
//                    '       ng-class="{selected: selecteditem === component}"' +
//                    '       ng-click="selectcomponent(component,$event)"' +
                    '       ng-include="\'component.html\'">' +
                    '   </div>' +
                    '</div>'
                );
                // component
                $templateCache.put('component.html',
                    '<div class="component" ' +
                    '   ng-mouseover="selectcomponent(component,$event)"' +
                    '   ng-mouseleave="selectcomponent({},$event)"' +
                    '   ng-class="{hover:selecteditem === component}" >' +
                    '   <div class="clearfix" ng-if="editable" >' +
                    '       <div class="pull-left label">{{component.type}}</div>' +
                    '       <div class="pull-right toolbar">' +
                    '           <div class="btn btn-default btn-xs" ng-click="showconfig(component)"><i class="fa fa-cog"></i> 配置</div>' +
                    '           <div class="btn btn-default btn-xs d-handle"><i class="fa fa-arrows"></i> 移动</div>' +
                    '           <div class="btn btn-default btn-xs" ng-click="deletecomponent(component,$event)"><i class="fa fa-close"></i> 删除</div>' +
                    '       </div>' +
                    '   </div>' +
                    '   <div ng-include="component.type + \'.html\'"></div>' +
                    '</div>'
                );
                // row
                $templateCache.put('row.html',
                    '<div class="row-fluid">' +
                    '   <div ng-repeat="component in component.children"' +
                    '       class="column col-xs-{{component.width}}" ng-include="\'list.html\'">' +
                    '   </div>' +
                    '</div>'
                );
                $templateCache.put('row.config.html',
                    '<div ng-repeat="column in component.children">\
                        <input type="text" ng-model="column.name">\
                        <input type="text" ng-model="column.width">\
                        <a ng-click="component.children.splice($index,1)"><i class="fa fa-close"></i></a>\
                    </div>\
                    <a ng-click="component.children.push({name: \'Col\', type: \'col\', width: \'6\', children: []})"><i class="fa fa-plus"></i></a>\
                    '
                );
                // 容器
                $templateCache.put('page.html',
                    '<div ng-include="\'list.html\'">' +
                    '</div>'
                );

                // tabs
                $templateCache.put('tabs.html',
                    '<ul class="nav nav-tabs">' +
                    '<li ng-repeat="component in component.children" role="presentation" ng-class="{active:component.active}">' +
                    '<a ng-click="selecttab($parent.component.children, $index)">{{component.name}}</a>' +
                    '</li>' +
                    '</ul>' +
                    '<!-- Tab panes -->' +
                    '<div class="tab-content">' +
                    '<div ng-repeat="component in component.children" role="tabpanel" class="tab-pane" ng-class="{active:component.active}" ' +
                    '   ng-include="\'list.html\'">' +
                    '</div>' +
                    '</div>'
                );
                $templateCache.put('tabs.config.html',
                    '<div ng-repeat="column in component.children">\
                        <input type="text" ng-model="column.name">\
                        <a ng-click="component.children.splice($index,1)"><i class="fa fa-close"></i></a>\
                    </div>\
                    <a ng-click="component.children.push({name: \'New Section\', type: \'tab\', children: []})"><i class="fa fa-plus"></i></a>\
                    '
                );
                $templateCache.put('panel.html',
                    '<div class="ibox">' +
                    '   <div class="ibox-title">' +
                    '      <h5>{{component.name}}</h5>' +
                    '      <div class="ibox-tools">' +
                    '      </div>' +
                    '   </div>' +
                    '   <div class="ibox-content" ng-include="\'list.html\'">' +
                    '   </div>' +
                    '</div>'
                );
                $templateCache.put('panel.config.html',
                    '<div >\
                        <input type="text" ng-model="component.name">\
                    </div>\
                    '
                );
                // datatable
                $templateCache.put('datatable.html',
                    //'<datatableconfig config="component.config" ng-if="editable"></datatableconfig>' +
                    '<datatable config="component.config"></datatable>'
                );
                $templateCache.put('datatable.config.html',
                    '<div><datatableconfig config="component.config"></datatableconfig></div>'
                );

                // text
                $templateCache.put('text.html',
                    '<div>{{component.html}}</div>'
                );
                $templateCache.put('text.config.html',
                    '<textarea ng-model="component.html"></textarea>'
                );
                // button
                $templateCache.put('button.html',
                    '<button class="btn btn-default {{component.class}}">{{component.name}}</button>'
                );
                $templateCache.put('button.config.html',
                    '<span>' +
                    '文字：<input type="text" ng-model="component.name" />' +
                    '</span>' +
                    '<span>' +
                    '样式：<input type="text" ng-model="component.class" />' +
                    '</span>' +
                    '<span>' +
                    '点击事件：<input type="text" ng-model="component.onclick" />' +
                    '</span>' +
                    '<select ng-model="component.type">' +
                    '<option value="button">button</option>' +
                    '<option value="dropdown">dropdown</option>' +
                    '</select>'
                );
                 // buttongroup
                $templateCache.put('buttongroup.html',
                    '<div class="btn-group">' +
                    '   <button class="btn btn-default {{component.class}}" ng-repeat="component in component.children">{{component.name}}</button>' +
                    '</div>'
                );
                $templateCache.put('buttongroup.config.html',
                    '<div ng-repeat="component in component.children">\
                        <span ng-include="\'button.config.html\'"></span>\
                        <a ng-click="$parent.component.children.splice($index,1)"><i class="fa fa-close"></i></a>\
                    </div>\
                    <a ng-click="component.children.push({name: \'New Button\', type: \'button\'})"><i class="fa fa-plus"></i></a>\
                    '
                );


                $scope.drop = function (item) {
                    item.id = new Date().getTime();
                }

                // 工具箱
                $scope.toolbox = [
                    {
                        name: '12',
                        type: 'row',
                        children: [
                            {
                                name: 'Col',
                                type: 'col',
                                width: '12',
                                children: []
                            }
                        ]
                    }, {
                        name: '6 6',
                        type: 'row',
                        children: [
                            {
                                name: 'Col',
                                type: 'col',
                                width: '6',
                                children: []
                            },
                            {
                                name: 'Col',
                                type: 'col',
                                width: '6',
                                children: []
                            }
                        ]
                    }, {
                        name: '8 4',
                        type: 'row',
                        children: [
                            {
                                name: 'Col',
                                type: 'col',
                                width: '8',
                                children: []
                            },
                            {
                                name: 'Col',
                                type: 'col',
                                width: '4',
                                children: []
                            }
                        ]
                    }, {
                        name: '4 8',
                        type: 'row',
                        children: [
                            {
                                name: 'Col',
                                type: 'col',
                                width: '4',
                                children: []
                            },
                            {
                                name: 'Col',
                                type: 'col',
                                width: '8',
                                children: []
                            }
                        ]
                    }, {
                        name: '4 4 4',
                        type: 'row',
                        children: [
                            {
                                name: 'Col',
                                type: 'col',
                                width: '4',
                                children: []
                            },
                            {
                                name: 'Col',
                                type: 'col',
                                width: '4',
                                children: []
                            },
                            {
                                name: 'Col',
                                type: 'col',
                                width: '4',
                                children: []
                            }
                        ]
                    }, {
                        name: 'Tabs',
                        type: 'tabs',
                        children: [
                            {
                                name: 'Section 1',
                                type: 'tab',
                                active:true,
                                children: [],
                            },
                            {
                                name: 'Section 2',
                                type: 'tab',
                                children: [],
                            }
                        ]
                    }, {
                        name: 'DataTable',
                        type: 'datatable',
                        config: {},
                        children: []
                    }, {
                        name: 'Panel',
                        type: 'panel',
                        children: []
                    }, {
                        name: '段落',
                        type: 'text',
                        html: ''
                    }, {
                        name: '按钮',
                        type: 'button',
                        class : '',
                        onclick : ''
                    }, {
                        name: '按钮组',
                        type: 'buttongroup',
                        children: []
                    }
                ];

                $scope.Component = $scope.component;
//                $scope.children = $scope.component.children;
                $scope.defaultconfig = { datasources: [] };
                $scope.Component = angular.extend($scope.Component, angular.extend($scope.defaultconfig, $scope.Component));

                // 选中
                $scope.selecteditem = null;
                $scope.selectcomponent = function (item, $event) {
                    if (!item) {
                        return;
                    }
                    if (!$scope.editable) {
                        return;
                    }
                    if ($scope.selecteditem) {
                        $scope.selecteditem.selected = false;
                    }
                    item.selected = true;
                    if (!item.id) {
                        item.id = item.key = new Date().getTime();
                    }
                    $scope.selecteditem = item;
                    console.log('选中了' + item.name);

                    // 堆栈遍历
                    $scope.path = [$scope.Component];
                    var node = findnode($scope.Component, 'id', item.id, $scope.path);
                    $event.stopPropagation();
                    console.log($scope.path);
                };
                this.selectcomponent = function (item) {
                    $scope.selectcomponent(item);
                }
                $scope.selecttab = function (options, id) {
                    angular.forEach(options, function (data, index) {
                        data.active = false;
                        if (index == id) {
                            data.active = true;
                        }
                    });
                    //item.active=true;
                }

                // 显示列布局编辑框
                $scope.showconfig = function (component) {
                    if (!$scope.editable) {
                        return;
                    }

                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        size:'lg',
                        template: '\
<div class="modal-header">\
    <h3 class="modal-title">\
        配置</h3>\
</div>\
<div class="modal-body" ng-include="component.type + \'.config.html\'">\
</div>\
',
                        controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, data) {
                            $scope.component = data.component;
                        },
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    component: component
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (returntext) {
                    }, function () {
                    });
                };


                // 数据源修改
                $scope.editdatasource = function(datasource) {
                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        templateUrl: '/areas/enter/content/query/datasource/edit.html',
                        controller: 'DataSourceEditController',
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function() {
                                return {
                                    datasource: datasource
                                };
                            },
                            deps: [
                                '$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load('/areas/enter/content/query/datasource/ctrl.js');
                                }
                            ]
                        }
                    });

                    modalInstance.result.then(function(data) {
//            datasource = angular.extend(datasource, data);
                    }, function() {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });
                };

                //$scope.select = function (item) {
                //    this.select(item)
                //    //if ($scope.selecteditem) {
                //    //    $scope.selecteditem.selected = false;
                //    //}
                //    //$scope.Component.selected = true;
                //    //$scope.selecteditem = $scope.Component;
                //    //console.log('选中了' + $scope.Component.name);
                //};

                // 删除
                $scope.deletecomponent = function (item, $event) {
                    // 遍历删除
                    var id = item.id;
                    if (id) {
                        removeinarray($scope.Component.children, 'id', item.id);
                    }
                    //for (var i = 0; i < $scope.Component.children.length; i++) {
                    //    if($scope.Component.children[i].id == id){
                    //        $scope.Component.children.splice(i,1);
                    //    }
                    //}
                };
                $scope.sortableConfig = {
                    sort: true,
                    handle: '.d-handle',
                    group: {
                        name: 'advanced',
                        pull: true,
                        put: true
                    },
                    animation: 150,
                    onAdd: function (obj) {
                        if (obj && obj.model) {
                            if (!obj.model.id) {
                                obj.model.id = obj.model.key = new Date().getTime();
                            }
                            if (obj.model.type == "row") {
                                for (var i = 0; i < obj.model.children.length; i++) {
                                    obj.model.children[i].id = obj.model.children[i].key = new Date().getTime();
                                }
                            }
                        }
                    }
                };

                $scope.sortableConfigtoolbox = {
                    sort: false,
                    group: {
                        name: 'advanced',
                        pull: 'clone',
                        put: false
                    },
                    animation: 150
                };


            },
            link: function ($scope, $element, $attrs, pCtrl) {


            }
        }
    })
    .directive('component', function ($filter, $compile, $uibModal) {
        var getTemplate = function (item, editable) {
            switch (item.type) {
                case 'row':
                    return '<componentlist children="options.children" dragable="false" editable="editable"></componentlist>';
                case 'col':
                    return '<componentlist children="options.children" dragable="true" editable="editable"></componentlist>';
                case 'tabs':
                    return '<ul class="nav nav-tabs">' +
                        '<li ng-repeat="item in options.children" role="presentation" ng-class="{active:item.active}">' +
                        '<a ng-click="selecttab(options.children, $index)" ng-dblclick="showtexteditor(item, \'name\')">{{item.name}}<button class="close closeTab" type="button" ng-click="options.children.splice($index,1)" ng-if="editable">×</button></a>' +
                        '</li>' +
                        '<li role="presentation" ng-if="editable">' +
                        '<a ng-click="options.children.push({name: \'New Section\',type: \'tab\',children: [],class: \'\'})"><i class="fa fa-plus"></i></a>' +
                        '</li>' +
                        '</ul>' +
                        '<!-- Tab panes -->' +
                        '<div class="tab-content">' +
                        '<div ng-repeat="item in options.children" role="tabpanel" class="tab-pane" ng-class="{active:item.active}">' +
                        '<component options="item" editable="editable">' +
                        '</component>' +
                        '</div>' +
                        '</div>';
                case 'tab':
                    return '<componentlist children="options.children" dragable="true" editable="editable"></componentlist>';
                case 'datatable':
                    if (editable) {
                        return '<datatableconfig config="options.config"></datatableconfig>';
                    } else {
                        return '<datatable config="options.config"></datatable>';
                    }
                case 'panel':
                    return '<div class="ibox">' +
                        '<div class="ibox-title" ng-dblclick="showtexteditor(options, \'name\')">' +
                        '<h5>{{options.name}}</h5>' +
                        '<div class="ibox-tools">' +
                        '</div>' +
                        '</div>' +
                        '<div class="ibox-content">' +
                        '<componentlist children="options.children" dragable="true" editable="editable"></componentlist>' +
                        '</div>' +
                        '</div>';
                default:
                    return '';
            }
        };
        return {
            restrict: "E",
            require: '^?design',
            scope: {
                // 设置指令对于的scope
                options: "=", // name 值传递 （字符串，单向绑定）
                selectcomponent: '&',
                editable: '='
            },

            replace: true,
            template: // 替换HTML (使用scope中的变量)
            '<div ng-click="selectcomponent($event);$event.stopPropagation()" ' +
//                    'dnd-draggable="options"' +
//                    'dnd-effect-allowed="move" ' +
//                    'dnd-moved="children.splice($index, 1)"' +
//                    'dnd-selected="options.selected = item"' +
            'ng-mouseenter="hover = editable && true" ' +
            'ng-mouseleave="hover = editable && false" ' +
            'ng-class="{\'layout-hover\':hover,\'layout-active\':options.selected}" ' +
            'ng-keyup="keypress($event)" ' +
            'tabIndex="0"' +
            'style="position:relative"' +
            'class="{{options.class}}">' +
                //'<div class="handle"><i class="fa fa-arrows" aria-hidden="true"></i></div>' +
                //'<componentlist children="options.children"></componentlist>' +
            '</div>',
            transclude: true,
            link: function ($scope, $element, $attrs, pCtrl) {
                $scope.selecttab = function (options, id) {
                    angular.forEach(options, function (data, index) {
                        data.active = false;
                        if (index == id) {
                            data.active = true;
                        }
                    });
                    //item.active=true;
                }
                $scope.pCtrl = pCtrl;
                // 重定义内容
                var template = getTemplate($scope.options, $scope.editable);
                $element.html(template);
                $compile($element.contents())($scope);
                if (!$scope.editable) {
                    $element.removeAttr('tabIndex');
                }

                var imagestyle = {}
                //if($scope.options.type == 'image'){
                //    imagestyle['background-image'] = 'url('++)';
                //}


                if (!$scope.options.style) {
                    $scope.options.style = {};
                }
                // 拖放配置
                $scope.sortableConfig = {
                    sort: true,
                    group: {
                        name: 'advanced',
                        pull: true,
                        put: true
                    },
                    animation: 150,
                    onAdd: function (obj) {
                        if (obj && obj.model && !obj.model.id) {
                            obj.model.id = obj.model.key = new Date().getTime();
                        }
                    }
                };
                // 组件选中
                $scope.selectcomponent = function ($event) {
                    if (!$scope.editable) {
                        return;
                    }
                    if ($event.stopPropagation) {
                        $event.stopPropagation();
                    }
                    $scope.pCtrl.selectcomponent($scope.options, $event)

                    //alert(1)
                    //$scope.pCtrl.select(item);
                };
                // 监听键盘事件
                $scope.keypress = function ($event) {
                    if (!$scope.editable) {
                        return;
                    }
                    $event.stopPropagation();
                    if ($event.keyCode == 8 || $event.keyCode == 46) {
                        $scope.pCtrl.delete($scope.options, $event)
                    }
                }

                // 显示文字编辑框
                $scope.showtexteditor = function (obj, key) {
                    if (!$scope.editable) {
                        return;
                    }
                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        template: '<div class="modal-header">\
    <h3 class="modal-title">\
        文字编辑</h3>\
</div>\
<div class="modal-body">\
    <div><input type="text" ng-model="data.obj[data.key]">\
    </div>\
</div>\
',
//                    templateUrl: '/areas/enter/content/query/detail.html',
                        controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, data) {
                            var $ctrl = this;
                            $scope.data = data;

                        },
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    obj: obj,
                                    key: key
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (returntext) {
                        data = returntext;
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });
                }
            }
        };
    })
    .directive('componentlist', function ($filter) {
        return {
            restrict: "E",
            require: '^?design',
            scope: {
                // 设置指令对于的scope
                children: "=", // name 值传递 （字符串，单向绑定）
                selectcomponent: '&',
                dragable: '=',
                editable: '='
            },

            replace: true,
            template: // 替换HTML (使用scope中的变量)
            '<div>' +
            '<div ng-if="editable">' +
            '<div ng-sortable="sortableConfig" class="layout">' +
            '<component ng-repeat="item in children" options="item" editable="editable">' +
            '</component>' +
            '</div>' +
            '</div>' +
            '<div class="layout" ng-if="!editable">' +
            '<component ng-repeat="item in children" options="item">' +
            '</component>' +
            '</div>' +
            '</div>',
            transclude: true,
            link: function ($scope, $element, $attrs, pCtrl) {
                $scope.pCtrl = pCtrl;
                $scope.sortableConfig = {
                    sort: $scope.dragable,
                    group: {
                        name: 'advanced',
                        pull: $scope.dragable,
                        put: $scope.dragable
                    },
                    animation: 150,
                    onAdd: function (obj) {
                        if (obj && obj.model && !obj.model.id) {
                            obj.model.id = obj.model.key = new Date().getTime();
                        }
                    }
                };
            }
        };
    });


function findnode(obj, key, value, path) {
    if (!path) path = [];
    if (obj && obj[key] == value) {
        return obj;
    }
    if (obj['children'] && obj['children'].length > 0) {
        for (var i = 0; i < obj['children'].length; i++) {
            path.push(obj['children'][i]);
            var node = findnode(obj['children'][i], key, value, path);
            if (node) {
                return node;
            }
            else {
                path.pop();
            }
        }
    }
    return null;
}

function removeinarray(arr, key, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == value) {
            arr.splice(i, 1);
            return;
        }
        if (arr[i].children && arr[i].children.length > 0) {
            removeinarray(arr[i].children, key, value);
        }
    }
}
