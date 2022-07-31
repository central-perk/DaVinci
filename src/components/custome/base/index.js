define(['app'], function(app) {
    app.directive('pgCustomeBase', ['$layerManage', '$compile', 'config', '$validator', '$utils', '$rootScope', '$pgManage', '$pgData',
        function factory($layerManage, $compile, config, $validator, $utils, $rootScope, $pgManage, $pgData) {
            var events = config.EVENTS;
            var directive = {
                restrict: 'E',
                require: 'ngModel',
                templateUrl: '/components/custome/base/index.html',
                replace: 'true',
                scope: {
                    page: '=ngModel'
                },
                link: function($scope, $element, $attrs) {
                    var flyer = $pgData.getFlyer();
                    var idSelectdPage = $pgManage.isCurPage($scope.page.id);
                    var inPgVessl = $element.parents('.mdl-pg-vessel').hasClass('mdl-pg-vessel');
                    $scope.curOperate = {};
                    if (idSelectdPage) {
                        $scope.effectViews = [{}];
                        var pageWatchOff = {};
                        var initAttrDic = {};
                        var watchkeys = ['page.layers', 'page.mask', 'page.fpscan', 'page.bg', 'page.effect', 'page.animates', 'page.transition'];
                        for (var i = 0; i < watchkeys.length; i++) {
                            pageWatchOff[watchkeys[i]] = (function(key) {
                                $scope.$watch(watchkeys[i], function(newVal, oldVal) {
                                    if (!initAttrDic[key]) {
                                        initAttrDic[key] = true;
                                        return;
                                    }
                                    if (newVal && oldVal) {
                                        $scope.page._es = config.PAGES.editState.change;
                                        if (key === 'page.transition') {
                                            onPageTransitionChange();
                                        }
                                    }
                                }, true);
                            }(watchkeys[i]));
                        }
                        var pageEditorClickOff = $rootScope.$on(events.pageEditorClick, function(event, data) {
                            if (data) {
                                if (data.action === 'editEffect') {
                                    $scope.effectViews = [{}];
                                    $scope.curOperate.type = 'effect';
                                } else if (data.action === 'notEditEffect') {
                                    $scope.curOperate.type = '';
                                }
                            }
                        });
                        var effectChangeOff = $scope.$on(events.effectChange, function($event, data) {
                            if (data) {
                                if (data.action === ('page-' + 'finshSlide')) {
                                    $scope.$apply(function() {
                                        $scope.page._layout = slides[data.index].layout;
                                    });
                                }
                            }
                        });
                        $scope.$on('$destroy', function() {
                            effectChangeOff();
                            pageEditorClickOff();
                            for (key in pageWatchOff) {
                                if (pageWatchOff[key]) {
                                    pageWatchOff[key]();
                                }
                            }
                        });
                        // 动画结束事件名
                        var aniEndName = (function() {
                            var eleStyle = document.createElement('div').style;
                            var verdors = ['a', 'webkitA', 'MozA', 'OA', 'msA'];
                            var endEvents = ['animationend', 'webkitAnimationEnd', 'animationend', 'oAnimationEnd', 'MSAnimationEnd'];
                            var animation;
                            for (var i = 0, len = verdors.length; i < len; i++) {
                                animation = verdors[i] + 'nimation';
                                if (animation in eleStyle) {
                                    return endEvents[i];
                                }
                            }
                            return 'animationend';
                        }());

                        //转场模式变化
                        function onPageTransitionChange() {
                            if (inPgVessl) {
                                var transferMode = flyer.transferMode;
                                var direction = transferMode === 'horizontal' ? 'left' : 'up';
                                var transitionType = getTransitionClass($scope.page.transition);
                                var activeClassStr = 'pt-active-' + direction + ' active page-clone ' + transitionType;
                                var prevClassStr = 'pt-prev-' + direction + ' active ' + transitionType;
                                var $page = $element.find('.page');
                                var $clonePage = $page.clone();
                                $element.addClass('paging');
                                $element.append($clonePage);
                                $clonePage.addClass(prevClassStr);
                                $page.addClass(activeClassStr);
                                $page.on(aniEndName, function() {
                                    $page.off(aniEndName);
                                    $clonePage.remove();
                                    $page.removeClass(activeClassStr);
                                    $element.removeClass('paging');
                                });
                            }
                        }

                        function getTransitionClass(transition) {
                            if (transition) {
                                return transition.type;
                            } else {
                                return 'scale';
                            }
                        }
                    }
                }
            };
            return directive;
        }
    ]);
});