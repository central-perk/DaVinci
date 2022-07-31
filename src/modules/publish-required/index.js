define(['app'], function(app) {
    app.directive('publishRequired', ['$rootScope', 'config',
        function($rootScope, config) {
            return {
                restrict: 'A',
                scope: {
                    status: '='
                },
                link: function($scope, $ele, $attrs) {

                    $scope.$watch('status', function(val) {
                        if ($scope.status === config.FLYERS.status.draft ||
                            $scope.status === config.FLYERS.status.freeze) {
                            var snippet = '<span class="mdl-publish-required text-danger">发布作品即可使用该功能</span>';
                            $ele[0].outerHTML = snippet;
                        }
                    })

                }
            };
        }
    ]);
});