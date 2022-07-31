define(['app'], function(app, config) {
    app.directive('pgBg', ['$compile', 'config', '$validator', '$utils', '$imageUpload', '$layerClipboard', '$rootScope', '$layerManage', '$pgManage', '$imageManage',
        function factory($compile, config, $validator, $utils, $imageUpload, $layerClipboard, $rootScope, $layerManage, $pgManage, $imageManage) {
            var events = config.EVENTS;
            var directive = {
                restrict: 'E',
                templateUrl: '/components/custome/bg/index.html',
                // replace:true,
                link: function($scope, $element, $attrs) {
                    $element.addClass('page-bg')
                    var inPgVessel = $element.parents('.mdl-pg-vessel').hasClass('mdl-pg-vessel');
                    var pgBgClickOff = $scope.$on(events.pageBgClick, function(e, data) {
                        if (!data || !inPgVessel) return;
                        if (data.page && data.page.id !== $scope.page.id) {
                            return;
                        }
                        if (data.action === 'changeBg') {
                            $scope.changeBg();
                        }
                        if (data.action === 'removeBg') {
                            $scope.removeBg();
                        }
                    });
                    $scope.menuBg = [
                        ['粘贴<span class="mod">+V</span>', function($itemScope, $event) {
                            var dropDivPageOffset = $('.drop-div>.page-base').offset();
                            $layerClipboard.paste({
                                x: $event.pageX - dropDivPageOffset.left,
                                y: $event.pageY - dropDivPageOffset.top
                            });
                        }],
                        null, ['替换背景', function($itemScope) {
                            $scope.changeBg();
                        }],
                        ['删除背景', function($itemScope) {
                            $scope.removeBg();
                        }]
                    ];
                    $scope.$on('$destroy', function() {
                        pgBgClickOff();
                    });
                    $scope.changeBg = function() {
                        $imageManage.init(null, {
                            title: '替换背景',
                            ratio: 0.632,
                            disableDynamic: true,
                            disableMulti: true
                        }).then(function(imagePacks) {
                            $scope.page.bg.customValue = imagePacks[0].url;
                            $scope.page.bg.cropUrl = imagePacks[0].cropUrl;
                            $scope.page.bg.crop = imagePacks[0].crop;
                            $scope.page.bg.customSwitch = true;
                            $scope.save();
                        });
                    };
                    $scope.save = function() {
                        $scope.$emit(events.pageEditorClick, {
                            action: 'savePage',
                            page: $scope.page
                        });
                    };
                    $scope.removeBg = function() {
                        $scope.page.bg.value = null;
                        $scope.page.bg.key = null;
                        $scope.page.bg.customValue = null;
                        $scope.page.bg.cropUrl = null;
                        $scope.save();
                    };

                    //点击空白区域
                    $scope.clickBg = function($event, _options) {
                        var options = _options || {};
                        $rootScope.$broadcast(events.pageBgClick, {
                            action: 'chooseBg',
                            init: options.init
                        });
                        if ($event && inPgVessel) {
                            //手机壳内组织冒泡
                            $event.stopPropagation();
                            return false;
                        }
                    };
                    var getBgAnimateClass = function(orientation, type) {
                        if (!orientation) return '';
                        if (type === 'stretch' || type === 'slide') {
                            return type + '-' + orientation;
                        } else {
                            return '';
                        }
                    };
                    var init = function() {
                        $scope.clickBg(null, {
                            init: $pgManage.isNewPage($scope.page.id)
                        });
                        $pgManage.clearNewPageID();
                    };
                    var curBgAnimateClass = '';
                    if (inPgVessel) {
                        init();
                        var bg = $scope.page.bg;

                        $scope.$watch('page.bg.animate', function(val) {
                            if (val) {
                                var $bgi = $element.find('.bgi-inner');
                                if (val.type === 'slide') {
                                    if (bg.animate.orientation === 'origin') {
                                        bg.animate.orientation = 'horizontal';
                                    }
                                }
                                if (curBgAnimateClass) {
                                    $bgi.removeClass(curBgAnimateClass);
                                }
                                if (bg.animate.switch) {
                                    curBgAnimateClass = getBgAnimateClass(bg.animate.orientation, bg.animate.type);
                                    if (curBgAnimateClass) {
                                        $bgi.addClass(curBgAnimateClass);
                                    }
                                }
                            }
                        }, true);
                    }
                }
            };
            return directive;
        }
    ]);
});