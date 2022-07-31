define(['app'], function(app) {
    //modalService to show modal
    app.service('$restAPI', ['$http', '$alert',
        function($http, $alert) {
            this.get = function(model, ID, callback) {
                $http({
                    method: 'get',
                    url: '/api/' + model + 's/' + ID
                }).
                success(function(data, status, headers, config) {
                    handle(data, callback);
                });
            }
            this.update = function(model, ID, form, callback) {
                $http({
                    method: 'put',
                    url: '/api/' + model + 's/' + ID,
                    data: form
                }).
                success(function(data, status, headers, config) {
                    handle(data, callback);
                });
            };
            this.create = function(model, form, callback) {

                $http({
                    method: 'post',
                    url: '/api/' + model + 's/',
                    data: form
                }).
                success(function(data, status, headers, config) {
                    handle(data, callback);
                });
            };
            this.list = function(model, query, callback) {
                $http({
                    method: 'get',
                    url: '/api/' + model + 's/?' + query
                }).
                success(function(data, status, headers, config) {
                    handle(data, callback);
                });
            }
            this.delete = function(model, ID, callback) {
                $http({
                    method: 'delete',
                    url: '/api/' + model + 's/' + ID
                }).
                success(function(data, status, headers, config) {
                    handle(data, callback);
                });
            }

            function handle(data, callback) {
                if (data.code === 200) {
                    callback(null, data)
                } else {
                     $alert.error(data.msg)
                }
            }
        }
    ]);


});
