// 加载
app.controller('ProjectsController', function ($scope, $resource, $state, $localStorage, rest_projects, $uibModal) {

    $scope.loadprojects = function () {
        // 获取项目列表
        rest_projects
            .list()
            .then(function (data) {
                switch (data.result) {
                    case 0:
                        $scope.projects=[];
                        $scope.projects = data.data;
                        if ($scope.projects.length == 1) {
                            $state.go('app.project.index', {id: $scope.projects[0].ID});
                        }
                        break;
                    default :
                        $state.go('access.loading');
                        break;
                }
            }, function () {
                $state.go('access.loading');
            });
    };
    $scope.loadprojects();

    $scope.showcreatedialog = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            size: 'sm',
            template: '<div class="modal-header">\n    <button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="$ctrl.cancel()"><span aria-hidden="true">&times;</span></button>\n    <h3 class="modal-title"> 创建项目</h3>\n</div>\n<div class="modal-body">\n    <div class="form-group">\n        <label class="control-label">项目名称</label>\n        <input ng-model="name" class="form-control" >\n    </div>\n</div>\n<div class="modal-footer">\n    <button class="btn btn-primary" type="button" ng-click="$ctrl.ok()">OK</button>\n    <button class="btn btn-default" type="button" ng-click="$ctrl.cancel()">Cancel</button>\n</div>',
            controller: function ($scope, $resource, $stateParams, $state, $parse, $filter, $uibModalInstance, rest_projects, data) {
                //$scope.component = data.component;
                $scope.error = "";

                var $ctrl = this;
                $ctrl.ok = function () {
                    rest_projects
                        .create({name: $scope.name})
                        .then(function (data) {
                            switch (data.result) {
                                case 0:
                                    $uibModalInstance.close();
                                    break;
                                default :
                                    $scope.error = data.Message;
                                    break;
                            }
                        });
                };
                $ctrl.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            controllerAs: '$ctrl',
            resolve: {
                data: function () {
                    return {
                        //component: component
                    };
                }
            }
        });

        modalInstance.result.then(function (returntext) {
            $scope.loadprojects();
        }, function () {
        });
    }
});
