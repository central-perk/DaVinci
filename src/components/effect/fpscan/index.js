define(['app'], function(app, config) {
    app.directive('pgEffectFpscan', ['config', '$validator', '$utils', '$sce', '$rootScope', '$timeout', '$imageManage',
        function factory(config, $validator, $utils, $sce, $rootScope, $timeout, $imageManage) {
            var templates = config.CPTS[config.FLYERS.categorys.interact].templates.effectComponents,
                effectBasePath = config.CPTS[config.FLYERS.categorys.interact].templates.effectBase;
            var directive = {
                require: '^pgEffectBase',
                restrict: 'E', //指令的使用方式，包括标签，属性，类，注释
                templateUrl: effectBasePath, //从指定的url地址加载模板
                replace: true,
                link: function($scope, $element, $attrs, pgEffectBase) {
                    var page = $scope.page;
                    page.fpscan = page.fpscan || {};
                    var fpscanBg = page.fpscan.bg,
                        fpscanFp = page.fpscan.fp,
                        layout = $scope.page._layout,
                        events = config.EVENTS,
                        reCreateDelay = 5000;
                    $scope.smTitleLeft = $validator.smTitleLeft;

                    function Fpscan(options) {
                        Fpscan.__super.apply(this, arguments);
                    }
                    Fpscan.prototype = _.create(pgEffectBase.Base.prototype, {
                        'constructor': Fpscan
                    });
                    Fpscan.__super = pgEffectBase.Base;
                    var pageFpscan = new Fpscan({
                        page: $scope.page,
                        slides: [{
                            layout: 'top.html'
                        }, {
                            layout: 'default.html'
                        }, {
                            layout: 'bottom.html'
                        }]
                    });
                    if ($scope.env === 'et') {
                        //编辑状态代码
                        $scope.bgs = config.CPTS[config.FLYERS.categorys.interact].fpscan.bgs;
                        $scope.fps = config.CPTS[config.FLYERS.categorys.interact].fpscan.fps;
                        // 选择指纹
                        $scope.chooseFp = function(_fp) {
                            if (!page.effect.enable) return;
                            fpscanFp.customSwitch = false;
                            fpscanFp.croping = false;
                            fpscanFp.value = _fp.uri;
                            fpscanFp.key = _fp.key;
                            pageFpscan.savePage();
                        };
                        // 删除自定义指纹
                        $scope.removeFp = function($event) {
                            fpscanFp.customValue = null;
                            fpscanFp.crop = {};
                            fpscanFp.cropUrl = null;
                            fpscanFp.customSwitch = false;
                            fpscanFp.croping = false;
                            pageFpscan.savePage();
                            $event.stopPropagation();
                            return false;
                        };
                        // 选择自定义指纹
                        $scope.chooseCustomFp = function($event) {
                            if (!page.effect.enable) return;
                            if (fpscanFp.cropUrl) {
                                fpscanFp.customSwitch = true;
                                pageFpscan.savePage();
                            }
                            $event.stopPropagation();
                            return false;
                        }
                        // 选择背景图片
                        $scope.chooseBg = function(_bg) {
                            if (!page.effect.enable) return;
                            fpscanBg.customSwitch = false;
                            fpscanBg.value = _bg.uri;
                            fpscanBg.key = _bg.key;
                            pageFpscan.savePage();
                        };
                        // 删除自定义背景图
                        $scope.removeBg = function($event) {
                            fpscanBg.customValue = null;
                            fpscanBg.crop = {};
                            fpscanBg.cropUrl = null;
                            fpscanBg.customSwitch = false;
                            pageFpscan.savePage();
                            $event.stopPropagation();
                            return false;
                        };
                        // 选择自定义背景图
                        $scope.chooseCustomBg = function($event) {
                            if (!page.effect.enable) return;
                            if (fpscanBg.cropUrl) {
                                fpscanBg.customSwitch = true;
                                pageFpscan.savePage();
                            }
                            $event.stopPropagation();
                            return false;
                        };
                        // 替换背景图
                        $scope.replaceBg = function() {
                            $imageManage.init(null, {
                                title: '替换背景',
                                ratio: 0.632,
                                disableDynamic: true,
                                disableMulti: true
                            }).then(function(imagePacks) {
                                fpscanBg.customValue = imagePacks[0].url;
                                fpscanBg.cropUrl = imagePacks[0].cropUrl;
                                fpscanBg.crop = imagePacks[0].crop;
                                fpscanBg.customSwitch = true;
                                pageFpscan.savePage();
                            });
                        };
                        // 替换指纹图片
                        $scope.replaceFp = function() {
                            $imageManage.init(null, {
                                title: '替换指纹',
                                ratio: 1,
                                disableDynamic: true,
                                disableMulti: true
                            }).then(function(imagePacks) {
                                fpscanFp.customValue = imagePacks[0].url;
                                fpscanFp.cropUrl = imagePacks[0].cropUrl;
                                fpscanFp.crop = imagePacks[0].crop;
                                fpscanFp.customSwitch = true;
                                pageFpscan.savePage();
                            });
                        }
                        $rootScope.$on(events.imageCropClick, function(event, data) {
                            var fpscanBgID = $scope.page.id + '-fpscan-bg',
                                fpscanFpID = $scope.page.id + '-fpscan-fp',
                                fpscanPic;
                            switch (data.id) {
                                case fpscanBgID:
                                    fpscanPic = fpscanBg;
                                    break;
                                case fpscanFpID:
                                    fpscanPic = fpscanFp;
                                    break;
                            }
                            if (fpscanPic) {
                                switch (data.action) {
                                    case 'preview':
                                        if (data.url) {
                                            fpscanPic.customValue = data.url;
                                        }
                                        if (data.cropUrl) {
                                            fpscanPic.cropUrl = data.cropUrl;
                                        }
                                        break;
                                    case 'select':
                                        if (data.url) {
                                            fpscanPic.customValue = data.url;
                                            fpscanPic.crop = data.crop;
                                        }
                                        break;
                                    case 'save':
                                        fpscanPic.customValue = data.url;
                                        fpscanPic.crop = data.crop;
                                        fpscanPic.cropUrl = data.cropUrl;
                                        fpscanPic.customSwitch = true;
                                        fpscanPic.croping = false;
                                        pageFpscan.savePage();
                                        break;
                                    case 'cancel':
                                        fpscanPic.customValue = data.url;
                                        fpscanPic.crop = data.crop;
                                        break;
                                }
                            };
                        });
                        $scope.validate = function() {
                            if ($validator.smTitleLeft($scope.page.fpscan.title) < 0) {
                                return false;
                            } else {
                                return true;
                            }
                        }
                        $scope.$watch('page.fpscan.title', function(val) {
                            $scope.canSave = $scope.validate();
                        }, true);
                        //监控 canSave
                        $scope.$watch('canSave', function(val) {
                            if (val === false) {
                                $scope.page._es = config.PAGES.editState.error;
                            } else {
                                $scope.page._es = config.PAGES.editState.initial;
                            }
                        });
                    } else {
                        var $pageFpscan, $fp, $line, $scaninfo, $touchArea;
                        var hastouch = "ontouchstart" in window ? true : false,
                            tapstart = hastouch ? "touchstart" : "mousedown",
                            tapend = hastouch ? "touchend" : "mouseup";
                        initEvent();
                        $scope.page.fpscan.opacity = typeof $scope.page.fpscan.opacity === 'undefined' ? 70 : $scope.page.fpscan.opacity;

                        function startTap() {
                            initElement();
                            hastouch = true;
                            $line.show();
                            $scaninfo.html('扫描中...');
                            $line.animate({
                                top: '-=110px'
                            }, 1000, function() {
                                $line.fadeOut(function() {
                                    // line位置还原
                                    $line.css({
                                        'top': '110px'
                                    });
                                });
                                $scaninfo.hide().html('扫描成功').fadeIn(600, function() {
                                    $scaninfo.fadeOut(800, function() {
                                        $touchArea.fadeOut();
                                        $fp.fadeOut();
                                        $pageFpscan.fadeOut(1500, function() {
                                            $touchArea.show();
                                            $fp.show();
                                            setTimeout(function() {
                                                $pageFpscan.show();
                                            }, 200);
                                            $scaninfo.html($scaninfo.data('text')).show();
                                            initEvent();
                                        });
                                    });
                                });
                                $('.mdl-pg-vessel .page-base').off(tapstart, '**').off(tapend, '**');
                                hastouch = false;
                            });
                        }

                        function endTap() {
                            if (hastouch) {
                                $line.hide();
                                $line.stop(true);
                                $line.css({
                                    'top': '110px'
                                });
                                $scaninfo.hide().html('扫描失败！请重新扫描').fadeIn();
                            }
                        }

                        function initElement() {
                            $pageFpscan = $('.page-fpscan');
                            $fp = $pageFpscan.find('.fp');
                            $line = $pageFpscan.find('.line');
                            $scaninfo = $pageFpscan.find('.info');
                            $touchArea = $pageFpscan.find('.touch-area');
                        }

                        function initEvent() {
                            $('.mdl-pg-vessel .page-base').off(tapstart, '**').off(tapend, '**').on(tapstart, '.page-fpscan .touch-area', startTap).on(tapend, '.page-fpscan .touch-area', endTap);
                        }
                        $scope.$watch('page.fpscan._layout', function(newValue, oldValue) {
                            initEvent();
                        });
                    }
                    var effectChangeOff = $scope.$on(events.effectChangeOff, function(event, data) {
                        $scope.init();
                        // 切换布局重新绑定事件
                        initEvent();
                    });
                    $scope.$watch('page.fpscan', function(val) {
                        $scope.init();
                        $scope.resetOpacity();
                    }, true);
                    $scope.resetOpacity = function() {
                        $element.find('.bg').css({
                            'opacity': $scope.page.fpscan.opacity / 100
                        });
                    };
                    $scope.$on('$destory', function() {
                        effectChangeOff();
                    });
                }
            };
            return directive;
        }
    ]);
});