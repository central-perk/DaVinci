define(['app'], function(app) {
    app.directive('userRelationBlk', ['$rootScope', 'config', '$chat', 'RelationService', '$flyerShare', '$notify', '$flyerView',
        function($rootScope, config, $chat, RelationService, $flyerShare, $notify, $flyerView) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/pages/user/relation/blk/index.html',
                replace: true,
                scope: {
                    relation: '=ngModel',
                    hideShare: '@',
                    hideRemove: '@',
                    onRemove: '&',
                    removeBtn: '@'
                },
                transclude: true,
                link: function($scope, $element, $attrs) {

                    // Boolean
                    $attrs.$observe('hideShare', function() {
                        $scope.hideShare = $scope.$parent.$eval($attrs.hideShare);
                    });
                    $attrs.$observe('hideRemove', function() {
                        $scope.hideRemove = $scope.$parent.$eval($attrs.hideRemove);
                    });

                    $scope.user = $scope.relation.user;
                    $scope.flyers = $scope.relation.templates || $scope.relation.flyers;

                    // 私信
                    $scope.chat = function() {
                        $chat.show({
                            user: $scope.user
                        });
                    };

                    $scope.showShare = function() {
                        $flyerShare.friend({
                            user: $scope.user
                        });

                    };

                    // 解除好友关系
                    $scope.remove = function() {
                        $scope.onRemove({
                            data: $scope.user
                        });
                    };

                    $scope.preview = function(flyer) {
                        $flyerView.show({
                            flyer: flyer
                        });
                    };
                },
                // controller: ['$scope', '$transclude', function($scope, $transclude) {
                // 	$transclude(function(clone, scope) {
                // 		console.log(clone);
                // 	});
                // }]
            };
        }
    ]);
});