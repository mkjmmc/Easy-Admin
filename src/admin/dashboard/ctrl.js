'use strict';

app.controller('dashboardController', function ($scope, $resource, $filter, $stateParams, $uibModal, $state, $log, $rootScope, dialogs, $timeout, result, $translate) {


    $scope.user = {
        AudioMinuteTotal: 0,
        VideoMinuteTotal: 0,
        Balance: '加载中'
    };
    $scope.AudioMinuteTotal7 = 0;
    $scope.VideoMinuteTotal7 = 0;

    // 查询账户信息
    $scope.queryinfo = function () {
        var $com = $resource($scope.app.host + "/Dashboard/");
        $com.get({}, function (data) {
            if (data.Code == 0) {
                $scope.user = data.Data;
                $scope.querylevels();
            }
            else {
                result.deal(data);
            }
        });
    };

    $scope.queryinfo();

    // 查询等级列表
    $scope.querylevels = function () {
        var $com = $resource($scope.app.host + "/Dashboard/Level");
        $com.get({}, function (data) {
            if (data.Code == 0) {
                $scope.levels = data.Data;
            }
            else {
                result.deal(data);
            }
        });
    };

    // 查询等级信息
    // $scope.querylevels();


    $scope.dataVideo = [];
    $scope.dataAudio = [];
    $scope.ticks = [];
    $scope.reflashplot = 0;
    //查询统计数据
    $scope.querystats = function (begindate, enddate) {
        var $com = $resource($scope.app.host + "/Dashboard/StatInfo?begindate=:begindate&enddate=:enddate", {begindate: '@begindate', enddate: '@enddate'});
        $com.get({begindate: $filter('date')(begindate.getTime(), 'yyyy-MM-dd'), enddate: $filter('date')(enddate.getTime(), 'yyyy-MM-dd')}, function (data) {
            if (data.Code == 0) {
                $scope.AudioMinuteTotal7 = 0;
                $scope.VideoMinuteTotal7 = 0;
                for (var i = 0; i < data.Data.length; i++) {
                    $scope.dataVideo.push([i, data.Data[i].VideoSecond]);
                    $scope.dataAudio.push([i, data.Data[i].AudioSecond]);
                    $scope.ticks.push([i, data.Data[i].StatDate]);

                    $scope.AudioMinuteTotal7 += data.Data[i].AudioSecond;
                    $scope.VideoMinuteTotal7 += data.Data[i].VideoSecond;
                }
                $scope.reflashplot = $scope.reflashplot + 1;
            }
            else {
                result.deal(data);
            }
        });
    };
    var now = new Date();
    $scope.querystats(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), now);
});