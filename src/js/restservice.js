// rest·þÎñ
app.factory('rest', function ($rootScope, $http, $q, $resource) {
    return {
        get: function (url, params) {
            var delay = $q.defer();
            var $com = $resource(url);
            $com.get(params, function (data) {
                delay.resolve(data);
            }, function (resp) {
                delay.reject(resp);
            });
            return delay.promise;
        },
        save: function (url, params, payload) {
            var delay = $q.defer();
            var $com = $resource(url, {}, {
                'save': {method: 'POST'},
            });
            $com.save(params,payload, function (data) {
                delay.resolve(data);
            }, function (resp) {
                delay.reject(resp);
            });
            return delay.promise;
        },
        update: function (url, params, data) {
            var delay = $q.defer();
            var $com = $resource(url, {}, {
                'update': {method: 'PUT'},
            });
            $com.update(params, data, function (data) {
                delay.resolve(data);
            }, function (resp) {
                delay.reject(resp);
            });
            return delay.promise;
        },
        delete: function (url, params) {
            var delay = $q.defer();
            var $com = $resource(url);
            $com.delete(params, function (data) {
                delay.resolve(data);
            }, function (resp) {
                delay.reject(resp);
            });
            return delay.promise;
        }
    }
});
app.factory('rest_access', function ($rootScope, rest) {
    return {
        get: function () {
            return rest.get(app.host + "/access/get.json");
        },
        getdata: function (id) {
            return rest.get(app.host + "/access/:id", {id: id});
        },
        delete:function(id){
            return rest.delete(app.host + "/access/:id",  {id: id});
        },
        save: function (data) {
            return rest.save(app.host + "/access", {}, data);
        },
        update: function (id, data) {
            return rest.update(app.host + "/access/:id", {id: id}, data);
        },
    }
});
