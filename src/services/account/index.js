define(['app'], function(app) {
    app.service('$account', ['$rootScope', '$http', '$q',
        function($rootScope, $http, $q) {
            var UserAmount = {
                init: function() {
                    var delay = $q.defer(),
                        self = this;
                    if ($rootScope.account) {
                        delay.resolve();
                    } else {
                        $http({
                            method: 'get',
                            url: '/api/account'
                        }).
                        success(function(data, status, headers, config) {
                            if (data.code === 200) {
                                $rootScope.account = data.msg.account;
                                delay.resolve();
                            } else {
                                $alert.error(data.msg);
                            }
                        });
                    }
                    return delay.promise;
                },
                set: function(_data) {
                    this.data = _data;
                },
                clear: function() {
                    $rootScope.account = null;
                }
            };

            return UserAmount;
        }
    ]);
});
