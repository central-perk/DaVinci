define(['app'], function(app) {
    app.directive('userFlyerCardFriend', ['$rootScope', 'config', '$flyerView', '$location', '$flyer', '$tool',
        function($rootScope, config, $flyerView, $location, $flyer, $tool) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/user/flyer/card-friend/index.html',
                replace: true,
                require: 'ngModel',
                scope: {
                    flyer: '=ngModel'
                },
                link: function($scope, $element, $attrs) {

                    $scope.cloneFlyer = function(flyer) {
                        $flyer.clone(flyer._id).then(function(result) {
                            window.location.pathname = '/fi/' + result + '/edit';
                        });
                    };

                    // 预览
                    $scope.preview = function() {
                        $flyerView.show({
                            flyer: $scope.flyer
                        });
                    };

                }
            };
        }
    ]);
});