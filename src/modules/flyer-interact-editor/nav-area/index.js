define([
    'app',
    'modules/pg-thumb/index'
], function(app) {
    app.directive('fiNavArea', ['config', '$rootScope', '$pgAddCustom', '$alert',
        function(config, $rootScope, $pgAddCustom, $alert) {
            var events = config.EVENTS,
                fiCategory = config.FLYERS.categorys.interact,
                stdCpts = config.CPTS[fiCategory].std;
            return {
                restrict: 'E',
                templateUrl: '/modules/flyer-interact-editor/nav-area/index.html',
                replace: true,
                link: function($scope, $ele, $attrs) {
                    $scope.isPageLenOutOfLimit = function() {
                        return $scope.flyer.content.length >= config.FLYERS.limit.pageLen;
                    };
                    $scope.stdCpts = stdCpts;

                    //新增页面
                    $scope.toAddCustomPage = function($event) {
                        if ($scope.isPageLenOutOfLimit()) {
                            return $alert.error('传单最多可创建' + config.FLYERS.limit.pageLen + '个页面')
                        };
                        $pgAddCustom.show(function(tpl) {
                            $scope.$emit(events.pgAddBtnClick, {
                                action: 'createCustom',
                                tpl: tpl
                            });
                        });
                    };

                    $ele.niceScroll({
                        cursorwidth: "8px",
                        cursorcolor: "#7F7F7F"
                    });
                }
            };
        }
    ]);
});
