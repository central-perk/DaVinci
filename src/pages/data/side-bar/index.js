define([
    'app'
], function(app) {
    app.directive('dtSideBar', ['config', '$rootScope', '$alert',
        function(config, $rootScope, $alert) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/data/side-bar/index.html',
                replace: true,
                link: function($scope, $ele, $attrs) {


                }
            };
        }
    ]);
});