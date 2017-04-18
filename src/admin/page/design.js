'use strict';
angular.module('app')
    .directive('design', function () {
        return {
            restrict: 'E',
            template: "<div class=\"design-container\" ng-init=\"\" ng-class=\"{\'editable\':editable}\">\n    <!--design panels-->\n    <div class=\"design-panels\" ng-show=\"editable\">\n        <div class=\"\" ng-if=\"editable\"><input type=\"text\" ng-model=\"config.name\" class=\"form-control\"/></div>\n        <div class=\" \" ng-if=\"editable\">\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\">\n                    <span>组件库</span>\n                </div>\n                <div ng-sortable=\"sortableConfigtoolbox\" class=\" list-group no-radius no-border  m-b-none\">\n                    <div ng-repeat=\"item in toolbox\" class=\" list-group-item hover-anchor b-a no-select ng-scope  m-l-none\"><span ng-bind=\"item.name\"></span></div>\n                </div>\n            </div>\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\"><h5>数据源</h5>\n\n                    <div class=\"ibox-tools\"><a ng-click=\"config.datasources.push({name:\'数据源\', configs:[]})\">添加</a></div>\n                </div>\n                <div class=\"list-group\">\n                    <a ng-repeat=\"ds in config.datasources\" class=\"list-group-item\" ng-click=\"editdatasource(ds)\"> {{ds.name}} <span class=\"badge\">{{ds.configs.length}}</span> </a>\n                </div>\n            </div>\n            <div class=\"panel panel-default\">\n                <div class=\"panel-heading\"><h5>子视图</h5>\n\n                    <div class=\"ibox-tools\"><a ng-click=\"config.views.push({type:\'view\',name:\'子视图\', children:[],buttons:[]})\">添加</a></div>\n                </div>\n                <div class=\"list-group\">\n                    <a class=\"list-group-item\" ng-click=\"editviews(config)\">主视图</a>\n                    <a ng-repeat=\"view in config.views\" class=\"list-group-item\" ng-click=\"editviews(view)\">{{view.name}}</a>\n                </div>\n            </div>\n        </div>\n\n\n    </div>\n    <div class=\"design-toolbar-topcenter\">\n        <div class=\"btn-group\" role=\"group\" aria-label=\"\">\n            <button type=\"button\" class=\"btn btn-default\" ng-click=\"scale=scale+0.25\"><i class=\'fa fa-plus\'></i></button>\n            <button type=\"button\" class=\"btn btn-default\">{{scale*100}}%</button>\n            <button type=\"button\" class=\"btn btn-default\" ng-click=\"scale=scale>0.25?scale-0.25:scale\"><i class=\'fa fa-minus\'></i></button>\n        </div>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"\">\n            <select ng-model=\'config.screenwidth\'\n                    ng-options=\'screen for screen in screens\'\n                    ng-disabled=\'config.lockscreenwidth\'\n                    class=\'form-control\'></select>\n        </div>\n        <div class=\"btn-group\" role=\"group\" aria-label=\"\">\n            <button type=\"button\" class=\"btn btn-default\"\n                    ng-click=\'config.lockscreenwidth=!config.lockscreenwidth\'\n                    uib-tooltip=\"{{config.lockscreenwidth?\'unlock the screen width\':\'lock the screen width to \' + config.screenwidth + \'px\'}}\"\n                    tooltip-append-to-body=\"true\">\n                <i class=\"fa fa-fw\" ng-class=\"{\'fa-lock\':config.lockscreenwidth,\'fa-unlock\':!config.lockscreenwidth}\"></i>\n            </button>\n        </div>\n        {{app.debug}}\n\n    </div>\n    <div style=\'position: absolute; bottom: 0; left: 0; right: 240px; height: 200px; overflow: scroll; z-index: 30003; background-color: #ffffff\' ng-if=\"debug\">\n        <div><br><br>{{config}}</div>\n    </div>\n    <!--design-body-->\n    <div class=\"design-body\">\n        <div class=\"design-page\"\n             ng-show=\"editable\"\n             ng-style=\"{\n        \'background-image\':\'linear-gradient(transparent 0px, transparent \'+scale*2+\'px, rgb(255, 255, 255) \'+scale*2+\'px, rgb(255, 255, 255) \'+scale*20+\'px), linear-gradient(to right, rgb(200, 195, 199) 0px, rgb(200, 195, 199) \'+scale*2+\'px, rgb(255, 255, 255) \'+scale*2+\'px, rgb(255, 255, 255) \'+scale*20+\'px)\'\n        ,\'background-size\':\'\'+scale*20+\'px \'+scale*20+\'px\'\n        }\">\n            <div class=\"layout-container\"\n                 ng-style=\"{\'transform\':\'scale(\'+scale+\',\'+scale+\')\',\'max-width\':config.screenwidth}\"\n                 ng-include=\"\'component.html\'\"></div>\n        </div>\n        <div class=\"design-page\"\n             ng-show=\"!editable\">\n            <div class=\"layout-container\"\n                 \n                 ng-style=\"{\'max-width\':config.lockscreenwidth ? config.screenwidth : \'\'}\"\n                 ng-include=\"\'component.html\'\"></div>\n        </div>\n    </div>\n\n</div>",
            replace: true,
            scope: {
                config: "=",
                editable: "=",
                debug: "="
            },
            controller: function ($scope, $templateCache, $uibModal, $interpolate, $resource, $location, $q, rest_pages, $stateParams, $timeout, $compile, $parse) {

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
                // 容器
                $templateCache.put('page.html',
                    '<div ng-include="\'list.html\'">' +
                    '</div>'
                );
                // 容器
                $templateCache.put('view.html',
                    '<div class="modal" style="display: block;position: relative;" tabindex="-1" role="dialog">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">{{component.title}}</h4>\n            </div>\n            <div class="modal-body" ng-include="\'list.html\'">\n            </div>\n            <div class="modal-footer">\n                <div ng-repeat="component in component.buttons" ng-include="\'button.html\'" include-replace>\n                </div>\n                <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->\n                <!--<button type="button" class="btn btn-primary">Save changes</button>-->\n            </div>\n        </div>\n        <!-- /.modal-content -->\n    </div>\n    <!-- /.modal-dialog -->\n</div><!-- /.modal -->'
                );
                $templateCache.put('view.config.html',
                    '<div class="form-horizontal ">\n    <div class="form-group">\n        <label class="col-sm-2 control-label">名称</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.name" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">标题</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.title" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">按钮</label>\n\n        <div class="col-sm-10">\n            <div ng-repeat="component in component.buttons" ng-include="\'button.config.html\'">\n                \n            </div>\n            <a class="btn btn-default" ng-click="component.buttons.push( {\n                        name: \'按钮\',\n                        type: \'button\',\n                        class: \'\',\n                        onclick: \'\'\n                    })"><i class="fa fa-plus"></i></a>\n            <!--<input type="text" ng-model="component.title" class="form-control">-->\n        </div>\n    </div>\n    <!--<input type="text" ng-model="component.title">-->\n</div>\n                    '
                );

                // 列表
                $templateCache.put('list.html',
                    '<div ng-sortable="sortableConfig" class="layout">' +
                        //'<div>' +
                        //'           <div class="btn btn-default btn-xs" ng-click="paste(component.children)" ng-if="1==1"><i class="fa fa-copy"></i> 黏贴</div>' +
                        //'</div>' +
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
                    '       <div class="pull-left label label-default">{{component.type}}</div>' +
                    '       <div class="pull-right toolbar">' +
                    '           <div class="btn btn-default btn-xs" ng-click="showconfig(component)"><i class="fa fa-cog"></i> 配置</div>' +
                        //'           <div class="btn btn-default btn-xs" ng-click="copy(component)"><i class="fa fa-copy"></i> 复制</div>' +
                    '           <div class="btn btn-default btn-xs d-handle" ng-if="component.type!=\'page\' && component.type!=\'view\'"><i class="fa fa-arrows"></i> 移动</div>' +
                    '           <div class="btn btn-default btn-xs" ng-click="deletecomponent(component,$event)" ng-if="component.type!=\'page\' && component.type!=\'view\'"><i class="fa fa-close"></i> 删除</div>' +
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
                    '<div class="panel panel-default">' +
                    '   <div class="panel-heading">' +
                    '      {{component.name}}' +
                    '      <div class="ibox-tools">' +
                    '      </div>' +
                    '   </div>' +
                    '   <div class="panel-body" ng-include="\'list.html\'">' +
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
                    '<div><datatable config="component.config" variables="variables" loaddata="utility.datasource.execute(name,config)" ondataupdate="dataupdate(config)"></datatable></div>'
                );
                $templateCache.put('datatable.config.html',
                    '<div>\n    <datatableconfig config="component.config" datasources="datasources" variables="variables" \n                     loaddata="utility.datasource.execute(name,config)"\n                     ondataupdate="dataupdate(config)"\n    ></datatableconfig>\n</div>'
                );

                // text
                $templateCache.put('template.html',
                    '<div bind-html-compile="component.html">{{component.html}}</div>'
                );
                $templateCache.put('template.config.html',
                    '<textarea ng-model="component.html" class="form-control" style="height: 500px;"></textarea>'
                );
                // button
                $templateCache.put('button.html',
                    '<button class="btn btn-default {{component.class}}" ng-click="execevent(component.events[\'click\'])">{{component.name}}</button>'
                );
                $templateCache.put('button.config.html',
                    '<div class="form-horizontal">\n    <div class="form-group">\n        <label class="col-sm-2 control-label">文字</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.name" class="form-control"/>\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">样式</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.class" class="form-control"/>\n        </div>\n    </div>\n    <div class="form-group" ng-init="component.events=!component.events?{click:[]}:component.events">\n        <label class="col-sm-2 control-label">点击事件</label>\n\n        <div class="col-sm-10">\n            <div ng-repeat="(type, funs) in component.events" ng-include="\'event.config.html\'"></div>\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">类型</label>\n\n        <div class="col-sm-10">\n            <select ng-model="component.type" class="form-control">\n                <option value="button">button</option>\n                <option value="dropdown">dropdown</option>\n            </select>\n        </div>\n    </div>\n    {{component}}\n</div>'
                );
                // buttongroup
                $templateCache.put('buttongroup.html',
                    '<div class="btn-group">' +
                    '   <button class="btn btn-default {{component.class}}" ng-repeat="component in component.children">{{component.name}}</button>' +
                    '</div>'
                );
                $templateCache.put('buttongroup.config.html',
                    '<div ng-repeat="component in component.children">\n    <span ng-include="\'button.config.html\'"></span>\n                        <a ng-click="$parent.component.children.splice($index,1)"><i class="fa fa-close"></i></a>\n                    </div>\n                    <a ng-click="component.children.push({name: \'New Button\', type: \'button\'})"><i class="fa fa-plus"></i></a>\n                    '
                );
                // input-text
                $templateCache.put('input-text.html',
                    '<div class="form-group">\n    <label for="{{component.key}}" ng-show="component.label.length>0">{{component.label}}</label>\n    <input type="text" class="form-control" id="{{component.key}}" placeholder="{{component.placeholder}}" ng-model="variables[component.model]">\n</div>'
                );
                $templateCache.put('input-text.config.html',
                    '<div class="form-group">\n    <label for="">Label Name</label>\n    <input type="text" class="form-control" placeholder="Label Name" ng-model="component.label">\n</div>\n<div class="form-group">\n    <label for="">Placeholder</label>\n    <input type="text" class="form-control" placeholder="Placeholder" ng-model="component.placeholder">\n</div>\n<div class="form-group">\n    <label for="">Value</label>\n    <input type="text" class="form-control" placeholder="Value" ng-model="variables[component.model]"/>\n</div>\n<div class="form-group">\n    <label for="">Variable name</label>\n    <input type="text" class="form-control" placeholder="Variable name" ng-model="component.model">\n</div>'
                );
                $templateCache.put('event.config.html',
                    '<div class="form-horizontal">\n    <div class="form-group" ng-init="funs=!funs ? [] : funs">\n        <label for="" class="col-sm-2 control-label">Type</label>\n\n        <div class="col-sm-10">\n            <select ng-model="type" class="form-control">\n                <option value="click">click</option>\n                <option value="submit">submit</option>\n            </select>\n        </div>\n    </div>\n    <div class="form-group" ng-if="type">\n        <label for="" class="col-sm-2 control-label">Functions</label>\n\n        <div class="col-sm-10 list-group">\n            <div ng-repeat="fun in funs" ng-include="\'eventfun.config.html\'" class="form-horizontal list-group-item">\n            </div>\n            <a ng-click="funs.push({name:\'\'})">添加</a>\n        </div>\n    </div>\n    {{event}}\n</div>'
                );

                $templateCache.put('eventfuns.config.html',
                    '<div class="form-group" ng-repeat="fun in event.funs">\n    <label for="">Function</label>\n    <select ng-model="fun.name">\n        <option value="execdatasource">execdatasource</option>\n    </select>\n    <input ng-model="fun.params" />\n\n    <select ng-model="fun.name">\n        <option value="execdatasource">execdatasource</option>\n    </select>\n</div>'
                );
                $templateCache.put('eventfun.config.html',
                    '<div class="form-group">\n    <label for="" class="col-sm-2 control-label">Function</label>\n\n    <div class="col-sm-10">\n        <select ng-model="fun.name" class="form-control">\n            <option value="execdatasource">execdatasource</option>\n            <option value="showdialog">showdialog</option>\n            <option value="closedialog">closedialog</option>\n            <option value="sendevent">sendevent</option>\n            <option value="setvariable">setvariable</option>\n        </select>\n    </div>\n</div>\n<div class="form-group" ng-init="fun.params=!fun.params?{}:fun.params" ng-if="fun.name">\n    <label for="" class="col-sm-2 control-label">params</label>\n\n    <div class="col-sm-10" ng-if="fun.name==\'execdatasource\'">\n        <select ng-model="fun.params.name" ng-options="datasource.name as datasource.name for datasource in datasources" class="form-control"></select>\n        <!--<input ng-model="fun.params" class="form-control"/>-->\n    </div>\n    <div class="col-sm-10" ng-if="fun.name==\'showdialog\'||fun.name==\'closedialog\'">\n        <select ng-model="fun.params.name" ng-options="view.name as view.name for view in views" class="form-control"></select>\n        <!--<input ng-model="fun.params" class="form-control"/>-->\n    </div>\n    <div class="col-sm-10" ng-if="fun.name==\'sendevent\'" ng-init="fun.params.data=!fun.params.data?{}:fun.params.data">\n        <select ng-model="fun.params.name" class="form-control">\n            <option value="datasource.reload">datasource.reload</option>\n        </select>\n        <select ng-if="fun.name==\'sendevent\' && fun.params.name==\'datasource.reload\'"\n                ng-model="fun.params.data.datasourcename" \n                ng-options="datasource.name as datasource.name for datasource in datasources" \n                class="form-control"></select>\n\n        <!--<input ng-model="fun.params" class="form-control"/>-->\n    </div>\n    <div class="col-sm-10" ng-if="fun.name==\'setvariable\'">\n        <input type="text" ng-model="fun.params.name" placeholder="name" class="form-control" />\n        <input type="text" ng-model="fun.params.value" placeholder="value" class="form-control" />\n        <!--<select ng-model="fun.params.name" ng-options="view.name as view.name for view in views" class="form-control"></select>-->\n        <!--<input ng-model="fun.params" class="form-control"/>-->\n    </div>\n</div>\n<div class="form-group" ng-init="fun.thens=!fun.thens ? [] : fun.thens" ng-if="fun.name">\n    <label for="" class="col-sm-2 control-label">Thens</label>\n\n    <div class="col-sm-10 list-group">\n        <div ng-repeat="fun in fun.thens" ng-include="\'eventfun.config.html\'" class="list-group-item">\n        </div>\n        <a ng-click="fun.thens.push({name:\'\'})">添加</a>\n    </div>\n</div>\n<a ng-click="$parent.$parent.fun.thens.splice($index,1)">删除</a>\n{{$parent.$parent.fun}}'
                );
                $templateCache.put('nav.html',
                    '<ul class="nav nav-xs nav-pills m-t m-b">\n    <li ui-sref-active="active" ng-repeat="component in component.children" ng-class="{active:interpolate(component.active)}">\n        <a href ng-click="execevent(component.events[\'click\'])">{{component.text}}</a>\n    </li>\n</ul>'
                );
                $templateCache.put('nav.config.html',
                    '<div ng-repeat="component in component.children">\n    <div class="form-group">\n        <label class="col-sm-2 control-label">显示文字</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.text" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">active</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.active" class="form-control">\n        </div>\n    </div>\n    <div class="form-group" ng-init="component.events=!component.events?{click:[]}:component.events">\n        <label class="col-sm-2 control-label">点击事件</label>\n\n        <div class="col-sm-10">\n            <div ng-repeat="(type, funs) in component.events" ng-include="\'event.config.html\'"></div>\n        </div>\n    </div>\n    <a ng-click="$parent.component.children.splice($index,1)"><i class="fa fa-close"></i></a>\n</div>\n<a ng-click="component.children.push({text: \'New Nav\'})"><i class="fa fa-plus"></i></a>\n                    '
                );
                $templateCache.put('form.html',
                    '<form ng-include="\'list.html\'" ng-submit="execevent(component.events[\'submit\'])"></form>'
                );
                $templateCache.put('form.config.html',
                    '<div class="form-horizontal">\n    <div class="form-group" ng-init="component.events=!component.events?{submit:[]}:component.events">\n        <label class="col-sm-2 control-label">Submit事件</label>\n\n        <div class="col-sm-10">\n            <div ng-repeat="(type, funs) in component.events" ng-include="\'event.config.html\'"></div>\n        </div>\n    </div>\n</div>'
                );
                $templateCache.put('list-group.html',
                    '<div><list-group config="component.config" variables="variables" loaddata="utility.datasource.execute(name,config)" ondataupdate="dataupdate(config)"></list-group>{{component}}</div>'
                );
                $templateCache.put('list-group.config.html',
                    '<list-group-config config="component.config" \n                   datasources="datasources" \n                   variables="variables"\n                   loaddata="utility.datasource.execute(name,config)"\n                   ondataupdate="dataupdate(config)"\n        >\n</list-group-config>'
                );
                //$templateCache.put('modal.html',
                //    '<div class="modal" style="display: block" tabindex="-1" role="dialog">\n    <div class="modal-dialog" role="document">\n        <div class="modal-content">\n            <div class="modal-header">\n                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n                <h4 class="modal-title">{{component.title}}</h4>\n            </div>\n            <div class="modal-body" ng-include="\'list.html\'">\n            </div>\n            <div class="modal-footer">\n                <div ng-repeat="component in component.buttons" ng-include="\'button.html\'" include-replace>\n                </div>\n                <!--<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>-->\n                <!--<button type="button" class="btn btn-primary">Save changes</button>-->\n            </div>\n        </div>\n        <!-- /.modal-content -->\n    </div>\n    <!-- /.modal-dialog -->\n</div><!-- /.modal -->'
                //);
                //$templateCache.put('modal.config.html',
                //    '<div class="form-horizontal ">\n    <div class="form-group">\n        <label class="col-sm-2 control-label">名称</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.name" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">标题</label>\n\n        <div class="col-sm-10">\n            <input type="text" ng-model="component.title" class="form-control">\n        </div>\n    </div>\n    <div class="form-group">\n        <label class="col-sm-2 control-label">按钮</label>\n\n        <div class="col-sm-10">\n            <div ng-repeat="component in component.buttons" ng-include="\'button.config.html\'">\n                \n            </div>\n            <a class="btn btn-default" ng-click="component.buttons.push( {\n                        name: \'按钮\',\n                        type: \'button\',\n                        class: \'\',\n                        onclick: \'\'\n                    })"><i class="fa fa-plus"></i></a>\n            <!--<input type="text" ng-model="component.title" class="form-control">-->\n        </div>\n    </div>\n    <!--<input type="text" ng-model="component.title">-->\n</div>\n                    '
                //);

                $scope.drop = function (item) {
                    item.id = new Date().getTime();
                };

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
                                active: true,
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
                        name: '模板',
                        type: 'template',
                        html: ''
                    }, {
                        name: '按钮',
                        type: 'button',
                        class: '',
                        onclick: ''
                    }, {
                        name: '按钮组',
                        type: 'buttongroup',
                        children: []
                    }, {
                        name: '文本输入框',
                        type: 'input-text',
                        placeholder: '',
                        model: '',
                        value: '',
                        label: ''
                    }, {
                        name: 'modal',
                        type: 'modal',
                        title: '',
                        children: [],
                        buttons: []
                    }, {
                        name: 'nav',
                        type: 'nav',
                        children: []
                    }, {
                        name: 'form',
                        type: 'form',
                        children: []
                    }, {
                        name: 'list-group',
                        type: 'list-group',
                        config: {},
                        children: []
                    }
                ];

                //this.scope = $scope;
                $scope.variables = angular.extend({}, $location.search());//{};

                //$scope.component = $scope.component;
//                $scope.children = $scope.component.children;
                $scope.defaultconfig = {
                    datasources: [],
                    views: [],
                    screenwidth: 1280,
                    lockscreenwidth: true
                };
                //$timeout(function(){
                //
                //})
                $scope.config = angular.extend($scope.config, angular.extend($scope.defaultconfig, $scope.config));
                $scope.component = $scope.config;
                $scope.currentview = $scope.component;

                $scope.scale = 1;
                $scope.screens = [800, 1024, 1280, 1440, 1680, 1920]
                //$scope.screenwidth = 1280;

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
                    // console.log('选中了' + item.name);

                    // 堆栈遍历
                    $scope.path = [$scope.component];
                    var node = findnode($scope.component, 'id', item.id, $scope.path);
                    $event.stopPropagation();
                    // console.log($scope.path);
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
                        size: 'lg',
                        template: '<div class="modal-header">\n    <h3 class="modal-title">\n        配置</h3>\n</div>\n<div class="modal-body" ng-include="component.type + \'.config.html\'">\n</div>\n\n',
                        controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, data) {
                            $scope.component = data.component;
                            $scope.variables = data.variables;
                            $scope.datasources = data.datasources;
                            $scope.execdatasource = data.execdatasource;
                            $scope.views = data.views;
                        },
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    component: component,
                                    variables: $scope.variables,
                                    datasources: $scope.config.datasources,
                                    execdatasource: $scope.execdatasource,
                                    views: $scope.config.views
                                };
                            }
                        }
                    });

                    modalInstance.result.then(function (returntext) {
                    }, function () {
                    });
                };

                $scope.editviews = function (view) {
                    view.buttons = view.buttons ? view.buttons : [];
                    $scope.currentviewname = view.name;
                    $scope.currentview = $scope.component = view;
                };

                $scope.copy = function (component) {
                    $scope.clipboard = component;
                }
                $scope.paste = function (array) {
                    array.push($scope.clipboard);
                };

                // 数据源修改
                $scope.editdatasource = function (datasource) {
                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        // templateUrl: '/areas/enter/content/query/datasource/edit.html',
                        template: '<div><datasource config="config"></datasource></div>',
                        controller: function ($scope, data) {
                            $scope.config = data.datasource;
                        },
                        controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    datasource: datasource
                                };
                            },
                            // deps: [
                            //     // '$ocLazyLoad',
                            //     // function ($ocLazyLoad) {
                            //     //     return $ocLazyLoad.load('/areas/enter/content/query/datasource/ctrl.js');
                            //     // }
                            // ]
                        }
                    });

                    modalInstance.result.then(function (data) {
//            datasource = angular.extend(datasource, data);
                    }, function () {
                        //$log.info('Modal dismissed at: ' + new Date());
                    });
                };

                $scope.interpolate = function (exec) {
                    var parseFunc = $parse(exec);
                    //var parseFunc = $interpolate(exec);
                    return parseFunc($scope.variables);
                }


                //$scope.dataupdate = function (params) {
                //    var delay = $q.defer();
                //    rest_pages
                //        .executedatasource($stateParams.projectid, params)
                //        .then(function (data) {
                //            if (data && data.result == 0) {
                //                // 更新成功，刷新数据
                //                //$scope.getdata($scope.page);
                //                delay.resolve(data.data);
                //            }
                //            else {
                //                delay.reject(data);
                //            }
                //            console.log(data)
                //        }, function (resp) {
                //            delay.reject(resp);
                //        })
                //    //var $com = $resource('/enter/query/Update');
                //    //$com.save({}, params, function (data) {
                //    //    if (data && data.result == 0) {
                //    //        // 更新成功，刷新数据
                //    //        delay.resolve(data.data);
                //    //    } else {
                //    //        delay.reject(data);
                //    //    }
                //    //    console.log(data)
                //    //}, function (resp) {
                //    //    delay.reject(resp);
                //    //    console.log(resp)
                //    //});
                //    return delay.promise;
                //}
                //
                //// 更新数据
                //$scope.updatedata = function (connectid, database, table, condition, modifier) {
                //    var params = {
                //        connectid: connectid,
                //        configs: [
                //            {
                //                "type": "update",
                //                "database": database,
                //                "table": table,
                //                "condition": condition,
                //                "modifier": modifier,
                //            }
                //        ]
                //    };
                //    var $com = $resource('/enter/query/Update');
                //    $com.save({}, params, function (data) {
                //        if (data && data.rows > 0) {
                //            // 更新成功，刷新数据
                //            $scope.getdata($scope.page);
                //        }
                //        console.log(data)
                //    });
                //}

                $scope.execevent = function (funs) {
                    // 执行指令
                    //eval.call($scope, cmd   );
                    console.log(funs)
                    if (!funs || funs.length == 0) {
                        return;
                    }
                    (function loop(i) {
                        var chain = $q.when();
                        chain = chain
                            .then(function () {
                                var fun = null;
                                switch (funs[i].name) {
                                    case "execdatasource":
                                        fun = $scope.utility.datasource.execute(funs[i].params.name).then(function (data) {
                                            $scope.utility.datasource.data[funs[i].params.name] = data.data;
                                            $scope.execevent(funs[i].thens);
                                        });
                                        break;
                                    case "showdialog":
                                        var modalInstance = $scope.showdialog(funs[i].params.name);
                                        // 保存instance
                                        $scope.modalInstance = $scope.modalInstance ? $scope.modalInstance : {};
                                        $scope.modalInstance[funs[i].params.name] = modalInstance;
                                        modalInstance.result.then(function (data) {
                                            //delay.resolve(data);
                                            $scope.execevent(funs[i].thens);
                                        }, function (resp) {
                                            //delay.reject(resp);
                                        });
                                        //fun = $scope.showdialog(funs[i].params.name).then(function(data){
                                        //    $scope.execevent(funs[i].thens);
                                        //});
                                        break;
                                    case "closedialog":
                                        if ($scope.modalInstance && $scope.modalInstance[funs[i].params.name]) {
                                            var instance = $scope.modalInstance[funs[i].params.name];
                                            instance.result.then(function (data) {
                                                //delay.resolve(data);
                                                $scope.execevent(funs[i].thens);
                                            }, function (resp) {
                                                //delay.reject(resp);
                                            });
                                            instance.close();
                                        }
                                        //fun = $uibModalInstance.close().then(function(data){
                                        //    $scope.execevent(funs[i].thens);
                                        //});
                                        break;
                                    case "sendevent":
                                        $scope.$broadcast(funs[i].params.name, funs[i].params.data);
                                        //$scope.$emit(funs[i].params.name);
                                        break;
                                    case "setvariable":
                                        $scope.variables[funs[i].params.name] = funs[i].params.value;
                                        $scope.execevent(funs[i].thens);
                                        break;

                                }
                            })
                            .then(function () {
                                i > funs.length - 2 || loop(i + 1);
                            });
                    })(0);
                    for (var i = 0; i < funs.length; i++) {

                    }
                    //$scope.$eval(cmd);
                }
                {
                    //$scope.$eval("execdatasource('添加模板').then(function(data){ console.log('添加返回',data); });");
                    //var fun = $parse("{{execdatasource('添加模板').then(function (data) {                    console.log('添加返回', data);                });}}");
                    //var result = new Function('this',"execdatasource('添加模板').then(function(data){ console.log('添加返回',data); });");
                    //var r = result($scope);
                    //var result = $compile("{{execdatasource('添加模板').then(function(data){ console.log('添加返回',data); })}}")($scope);
                    //$scope.execcommend();
                }

                // 显示对话框
                $scope.showdialog = function (name) {
                    //var delay = $q.defer();
                    var view = getobjinarray($scope.config.views, 'name', name);
                    if (!view) {
                        return;
                    }
                    var $ctrl = this;
                    var modalInstance = $uibModal.open({
                        animation: true,
                        ariaLabelledBy: 'modal-title',
                        ariaDescribedBy: 'modal-body',
                        // templateUrl: '/areas/enter/content/query/datasource/edit.html',
                        template: '<div>\n    <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">{{currentview.title}}</h4>\n    </div>\n    <div class="modal-body">\n        <div ng-repeat="component in config.views | filter:{name:currentview.name}" ng-init="editable=false" ng-include="\'list.html\'"></div>\n    </div>\n    <div class="modal-footer">\n        <div ng-repeat="component in currentview.buttons" ng-include="\'button.html\'" include-replace>\n        </div>\n    </div>\n</div><!-- /.modal-content -->',
                        controller: function ($scope, data) {
                            $scope.currentview = getobjinarray($scope.config.views, "name", data.name);
                            $scope.currentviewname = data.name;
                        },
                        scope: $scope,
                        //controllerAs: '$ctrl',
                        resolve: {
                            data: function () {
                                return {
                                    name: name
                                };
                            },
                            // deps: [
                            //     // '$ocLazyLoad',
                            //     // function ($ocLazyLoad) {
                            //     //     return $ocLazyLoad.load('/areas/enter/content/query/datasource/ctrl.js');
                            //     // }
                            // ]
                        }
                    });
                    return modalInstance;

                    //modalInstance.result.then(function (data) {
                    //    delay.resolve(data);
                    //
                    //}, function (resp) {
                    //    delay.reject(resp);
                    //});

                    //return delay.promise;
                };

                $scope.hidedialog = function (name) {

                };
                //$scope.select = function (item) {
                //    this.select(item)
                //    //if ($scope.selecteditem) {
                //    //    $scope.selecteditem.selected = false;
                //    //}
                //    //$scope.component.selected = true;
                //    //$scope.selecteditem = $scope.component;
                //    //console.log('选中了' + $scope.component.name);
                //};

                // 删除
                $scope.deletecomponent = function (item, $event) {
                    // 遍历删除
                    var id = item.id;
                    if (id) {
                        removeinarray($scope.component.children, 'id', item.id);
                    }
                    for (var i = 0; i < $scope.component.views.length; i++) {
                        removeinarray($scope.component.views[i].children, 'id', item.id);
                    }
                    //for (var i = 0; i < $scope.component.children.length; i++) {
                    //    if($scope.component.children[i].id == id){
                    //        $scope.component.children.splice(i,1);
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

                // 系统工具类
                $scope.utility = {
                    datasource: {
                        data: {}
                    }
                };
                // 获取数据
                $scope.utility.datasource.getdata = function (name, reflash) {
                    // 判断是否已有数据
                    if (!reflash && $scope.utility.datasource.data[name]) {
                        return $scope.utility.datasource.data[name];
                    }
                    else {
                        if (!$scope.utility.datasource.data[name]) {
                            $scope.utility.datasource.data[name] = [];
                        }
                        $scope.utility.datasource.execute(name)
                            .then(function (data) {
                                $scope.utility.datasource.data[name] = data.data;
                            });
                        return $scope.utility.datasource.data[name];
                    }
                };
                // 执行数据源
                $scope.utility.datasource.execute = function (name, config) {
                    // alert(name)
                    var delay = $q.defer();
                    // 获取配置
                    var ds = getobjinarray($scope.component.datasources, 'name', name);
                    if (!ds) {
                        console.log('数据源不存在')
                        return;
                    }
                    var params = angular.copy(ds);
                    // 对数据源变量进行处理
                    for (var i = 0; i < params.configs.length; i++) {
                        if (config && config[params.configs[i].name]) {
                            if (config[params.configs[i].name].limit) {
                                params.configs[i].limit = config[params.configs[i].name].limit;
                            }
                            if (config[params.configs[i].name].sort && config[params.configs[i].name].sort.length > 0) {
                                params.configs[i].sort = config[params.configs[i].name].sort;
                            }
                            if (config[params.configs[i].name].condition) {
                                for (var k = 0; k < config[params.configs[i].name].condition.length; k++) {
                                    var obj = getobjinarray(params.configs[i].condition, 'name', config[params.configs[i].name].condition[k].name);
                                    if (!obj) {
                                        params.configs[i].condition.push(config[params.configs[i].name].condition[k]);
                                    }
                                    else {
                                        obj.opt = config[params.configs[i].name].condition[k].opt;
                                        obj.value = config[params.configs[i].name].condition[k].value;
                                    }
                                    // for (var j = 0; j < params.configs[i].condition.length; j++) {
                                    //     if (params.configs[i].condition[j].name == config[params.configs[i].name].condition[k].name) {
                                    //         params.configs[i].condition[j].opt = config[params.configs[i].name].condition[k].opt;
                                    //         params.configs[i].condition[j].value = config[params.configs[i].name].condition[k].value;
                                    //     }
                                    // }
                                }
                            }
                            if (config[params.configs[i].name].condition) {
                            }
                        }
                        for (var j = 0; j < params.configs[i].values.length; j++) {
                            var parseFunc = $interpolate(params.configs[i].values[j].value);
                            params.configs[i].values[j].value = parseFunc($scope.variables);
                            console.log(params.configs[i].values[j].value)
                        }
                        for (var j = 0; j < params.configs[i].condition.length; j++) {
                            var parseFunc = $interpolate(params.configs[i].condition[j].value);
                            params.configs[i].condition[j].value = parseFunc($scope.variables);
                            console.log(params.configs[i].condition[j].value)
                        }
                        params.configs[i].condition = params.configs[i].condition.filter(function (element, index, array) {
                            if (element.opt != 'is null' && element.opt != 'is not null') {
                                if (element.value.length == 0) {
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                    // for (var i = 0; i < params.configs.length; i++) {
                    //     for (var j = 0; j < params.configs[i].condition.length; j++) {
                    //         var parseFunc = $interpolate(params.configs[i].condition[j].value);
                    //         params.configs[i].condition[j].value = parseFunc($scope.variables);
                    //         console.log(params.configs[i].condition[j].value)
                    //     }
                    // }
                    // if(config){
                    //     params.configs[i].limit = limit
                    // }
                    console.log(params)
                    rest_pages
                        .executedatasource($stateParams.projectid, params)
                        .then(function (data) {
                            if (data && data.result == 0) {
                                // 更新成功，刷新数据
                                //$scope.getdata($scope.page);
                                delay.resolve(data.data);
                            }
                            else {
                                delay.reject(data);
                            }
                            console.log(data)
                        }, function (resp) {
                            delay.reject(resp);
                        })
                    // var $com = $resource('/enter/query/Update');
                    // $com.save({}, params, function (data) {
                    //     if (data && data.result == 0) {
                    //         // 更新成功，刷新数据
                    //         //$scope.getdata($scope.page);
                    //         delay.resolve(data.data);
                    //     }
                    //     else {
                    //         delay.reject(data);
                    //     }
                    //     console.log(data)
                    // }, function (resp) {
                    //     delay.reject(resp);
                    // });
                    return delay.promise;
                };
                // 更新数据
                $scope.utility.updatedata = function (datasourcename, collectionname, condition, modifier) {
                    var delay = $q.defer();

                    var tableinfo = $scope.utility.datasource.getdata(datasourcename)[collectionname];
                    var md = [];
                    var cd = [];
                    for (var p in modifier) {
                        md.push({name: p, value: modifier[p]});
                    }

                    for (var p in condition) {
                        cd.push({name: p, opt: '=', value: condition[p]});
                    }
                    if (cd.length == 0) {
                        alert('未设置该表的主键，不建议更新');
                        delay.reject('未设置该表的主键，不建议更新');
                    }
                    else{
                        var params = {
                            connectid: tableinfo.connectid,
                            configs: [
                                {
                                    "type": "update",
                                    "database": tableinfo.database,
                                    "table": tableinfo.table,
                                    "condition": cd,
                                    "modifier": md,
                                }
                            ]
                        };
                        rest_pages
                            .executedatasource($stateParams.projectid, params)
                            .then(function (data) {
                                if (data && data.result == 0) {
                                    // 更新成功，刷新数据
                                    //$scope.getdata($scope.page);
                                    $scope.utility.datasource.getdata(datasourcename, true);
                                    delay.resolve(data.data);
                                }
                                else {
                                    delay.reject(data);
                                }
                                console.log(data)
                            }, function (resp) {
                                delay.reject(resp);
                            })
                    }
                    return delay.promise;
                }
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
                        //data = returntext;
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

function getobjinarray(arr, key, value) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == value) {
            return arr[i];
        }
    }
    return null;
}