define(['app', 'pages/data/form/index'], function(app) {
    app.directive('dtMainArea', ['config', '$rootScope', '$location', '$state',
        function(config, $rootScope, $location, $state) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/data/main-area/index.html',
                replace: true,
                link: function($scope, $ele, $attrs) {


                    $scope.backToFlyersPage = function() {
                        $state.go('puser', {
                            userID: $rootScope.user._id,
                            appID: appID
                        });
                    };
                }
            };
        }
    ]);
});