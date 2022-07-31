define(['app'], function(app) {
    app.service('$planAmount', ['config', '$rootScope', '$http', '$q', '$alert',
        function(config, $rootScope, $http, $q, $alert) {
            var events = config.EVENTS;
            var PlanAmount = {
                data: {

                },
                init: function() {
                    var delay = $q.defer(),
                        self = this;
                    $http({
                        method: 'get',
                        url: '/api/plan/amount'
                    }).
                    success(function(data, status, headers, config) {
                        if (data.code === 200) {
                            $rootScope.planAmount = data.msg.planAmount;
                            $rootScope.serviceAmount = data.msg.serviceAmount;
                            delay.resolve();
                        } else {
                            $alert.error(data.msg);
                        }
                    });

                    return delay.promise;
                },
                clear: function() {
                    $rootScope.planAmount = null;
                    $rootScope.serviceAmount = null;
                },
                set: function(_data) {
                    this.data = _data;
                }
            };

            return PlanAmount;
        }
    ]);
});
