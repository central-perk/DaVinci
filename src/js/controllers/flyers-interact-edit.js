define(['app',
    'modules/flyer-interact-editor/index',
    'modules/flyer-interact-preview/index',
    'services/loading/index',
], function(app) {
    app.controller('EditorController', ['$rootScope', '$state', 'config', '$scope', '$http', '$flyer', '$location', '$routeParams', '$alert', '$loading', '$compile', 'FlyerService', 'flyer',
        function($rootScope, $state, config, $scope, $http, $flyer, $location, $routeParams, $alert, $loading, $compile, FlyerService, flyer) {
            var events = config.EVENTS,
                flyerID = $routeParams.flyerID;
            $rootScope.flyerBoardOperate = config.FLYERS_PAGE.board.operates.edit;
            $scope.flyer = flyer;
            $state.current.pageTitle = flyer.title;
            $scope.init = function() {
                $scope.$broadcast(events.flyerRouteChange, {
                    action: 'edit'
                });
            };
        }
    ]);
});