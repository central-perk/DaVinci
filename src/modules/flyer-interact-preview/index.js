// 交互作品预览
define(['app'], function(app) {
    app.directive('flyerInteractPreview', ['config', '$loading', '$rootScope',
        function(config, $loading, $rootScope) {
            var events = config.EVENTS;
            return {
                restrict: 'E',
                templateUrl: '/modules/flyer-interact-preview/index.html',
                replace: true,
                scope: {},
                link: function($scope, $element, $attrs) {
                    var $iframe = document.getElementById("iframe-interact-preview");
                    // listionPreview

                    var listenPreviewOff = $rootScope.$on('interactOperateClick', function($event, data) {
                        if (data && data.action === 'preview' && data.flyer) {
                            var flyer = data.flyer,
                                flyerID = flyer._id;


                            if (!data.tplMode) {
                                $scope.preview_url = '/f/' + flyerID + '/preview';
                            } else {
                                $scope.preview_url = '/templates/' + flyerID + '/preview?version=live';

                            }
                            $scope.atPreview = true;
                            $($iframe.contentWindow)
                                .focus();
                            bindEvent(event);
                        }
                    });

                    function bindEvent(event) {
                        if (window.hidePreview) return;
                        window.__DVC = window.__DVC || {};
                        window.__DVC.hidePreview = hidePreview;

                    }

                    function hidePreview() {
                        $scope.$apply(function() {
                            $scope.atPreview = false;
                            $scope.preview_url = ' '; // 必须是空格，否则src无法清空
                            $scope.$emit(events.designTbClick, {
                                action: 'hidePreview'
                            });
                        });
                        $iframe.onload = null;
                    }

                    $scope.$on('$destroy', function() {
                        listenPreviewOff();
                    });
                }
            };
        }
    ]);
});