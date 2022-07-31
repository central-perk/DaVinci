define(['app'], function(app) {
    app.directive('plazaCard', ['$rootScope', 'config', '$alert', '$flyerView', '$tool',
        function factory($rootScope, config, $alert, $flyerView, $tool) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/plaza/card/index.html',
                replace: true,
                scope: {
                    flyer: '=ngModel',
                },
                link: function($scope, $element, $attrs) {

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