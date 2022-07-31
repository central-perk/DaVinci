define([
    'app',
    'js/sns/share'
], function(app) {
    app.directive('fvFlyer', ['config', '$rootScope', '$alert',
        function(config, $rootScope, $alert) {
            return {
                restrict: 'E',
                templateUrl: '/common/service/flyer-view/flyer/index.html',
                replace: true,
                scope: {
                    flyer: '=ngModel'
                },
                link: function($scope, $ele, $attrs) {

                    $rootScope.$broadcast('viewPreviewClick', {
                        flyerID: $scope.flyer._id
                    });

                    Share({
                        flyerID: $scope.flyer._id,
                        flyerTitle: $scope.flyer.title,
                        flyerCover: $scope.flyer.cover ? $scope.flyer.cover.replace('screenshot', 'screenshot_full') : '',
                        flyerLink: $scope.flyer.link,
                        hidePopularize: $rootScope.user.isAgent
                    });

                }
            };
        }
    ]);
});