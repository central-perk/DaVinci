define(['app'], function(app, config) {
    app.directive('pgEffectMask', ['config', '$validator', '$utils', '$sce', '$rootScope', '$timeout', '$imageManage',
        function factory(config, $validator, $utils, $sce, $rootScope, $timeout, $imageManage) {
            var templates = config.CPTS[config.FLYERS.categorys.interact].templates.effectComponents,
                effectBasePath = config.CPTS[config.FLYERS.categorys.interact].templates.effectBase,
                sizeConfig = config.SCREEN_SIZE.editor.interact;
            var directive = {
                require: '^pgEffectBase',
                restrict: 'E', //指令的使用方式，包括标签，属性，类，注释
                templateUrl: effectBasePath, //从指定的url地址加载模板
                replace: true,
                link: function($scope, $element, $attrs, pgEffectBase) {
                    var page = $scope.page,
                        layout = $scope.page._layout,
                        events = config.EVENTS,
                        reCreateDelay = 3000,
                        $carousel,
                        drawPercent = $scope.page.mask.drawPercent || 20;
                    var Mask = function() {};
                    Mask.slides = [{
                        layout: 'top.html'
                    }, {
                        layout: 'center.html'
                    }, {
                        layout: 'bottom.html'
                    }];
                    //继承Base所有属性和方法
                    Mask.prototype = new pgEffectBase.Base({
                        slides: Mask.slides,
                        page: $scope.page
                    });
                    //编辑状态代码
                    $scope.editInit = function() {
                        $scope.$validator = $validator;
                        $scope.smTitleLeft = $validator.smTitleLeft;
                        //获取默认图片列表
                        $scope.bgs = config.CPTS[config.FLYERS.categorys.interact].mask.bgs;
                        //选择图片
                        $scope.chooseBg = function(_bg) {
                            if ($scope.page.effect.enable) {
                                $scope.page.mask.customSwitch = false;
                                $scope.page.mask.value = _bg.uri;
                                $scope.page.mask.key = _bg.key;
                                $scope.save();
                            } else {
                                return;
                            }
                        };
                        //选择定制图片
                        $scope.chooseCustomBg = function($event) {
                            if ($scope.page.effect.enable) {
                                $scope.page.mask.customSwitch = true;
                                $scope.save();
                            } else {
                                return;
                            }
                            $event.stopPropagation();
                            return false;
                        };
                        $scope.save = function() {
                            $scope.$emit(events.pageEditorClick, {
                                action: 'savePage',
                                page: $scope.page
                            });
                        };
                        //去除图片
                        $scope.removeBg = function($event) {
                            $scope.page.mask.customSwitch = false;
                            $scope.page.mask.customValue = null;
                            $scope.page.mask.customLocalValue = null;
                            $scope.page.mask.cropUrl = null;
                            $scope.save();
                            $event.stopPropagation();
                            return false;
                        };
                        // 上传背景图
                        $scope.replaceBg = function() {
                            $imageManage.init(null, {
                                title: '替换背景',
                                ratio: 0.632,
                                disableDynamic: true,
                                disableMulti: true,
                                storageLocal: false
                            }).then(function(imagePacks) {
                                $scope.page.mask.customValue = imagePacks[0].url;
                                $scope.page.mask.cropUrl = imagePacks[0].cropUrl;
                                $scope.page.mask.crop = imagePacks[0].crop;
                                $scope.page.mask.customLocalValue = imagePacks[0].localCropUrl;
                                $scope.page.mask.customSwitch = true;
                                $scope.save();
                            });
                        };
                        $scope.validate = function() {
                            if ($validator.smTitleLeft($scope.page.mask.title) < 0) {
                                return false;
                            } else {
                                return true;
                            }
                        };
                    };
                    //涂抹的回调函数
                    function draw(percent) {
                        drawPercent = $scope.page.mask.drawPercent;
                        if (percent > drawPercent) {
                            $element.find('.page-mask .bg').fadeOut(reCreateDelay, function() {
                                $scope.init($scope.page.mask._layout, $element);
                            });
                        }
                    }
                    $scope.getNewPageMaskID = function() {
                        return 'page-mask' + new Date().getTime();
                    };
                    //初始化涂抹效果
                    $scope.init = function(layout, $elem) {
                        if ($element.parents('.pg-thumb').length === 1 || $element.parents('.edit-area').length === 1) {
                            return;
                        }
                        if (!$elem) {
                            return;
                        }
                        var layout = layout || 'bottom.html',
                            id = $scope.getNewPageMaskID(),
                            maskBg = $scope.page.mask.value;
                        $scope.page.mask.opacity = typeof $scope.page.mask.opacity === 'undefined' ? 70 : $scope.page.mask.opacity;
                        $pageMask = $elem.find('.page-mask .bg');
                        if (!$scope.page.effect.enable || $scope.page.effect.name !== 'mask') {
                            $pageMask.hide();
                            return;
                        }
                        $elem.find('.page-mask .bg').attr('id', id);
                        //涂抹的图片
                        if ($scope.page.mask.customSwitch) {
                            //('/' + $scope.page.mask.customLocalValue) ||本地
                            maskBg = $scope.page.mask.customValue;
                        }
                        $pageMask.find('canvas').remove();
                        $pageMask.show();
                        lottery = new Lottery(id, maskBg, 'image', sizeConfig.width, sizeConfig.height, draw, 'drop-div');
                        lottery.init({
                            value: maskBg,
                            type: 'image',
                            text: $scope.page.mask.title,
                            textVerticalAlign: layout.split('.')[0],
                            fixedWindow: true
                        });
                        $scope.resetOpacity();
                    };
                    var objPage = new Mask();
                    $scope.$watchCollection('[page.mask.title,' + ' page.mask.key, page.mask.value ,' + ' page.mask.customValue, page.mask.customSwitch,' + ' page.mask.drawPercent, page.effect.name,page.effect.enable, page.mask.cropUrl]', function(newVal, oldVal) {
                        if (newVal.toString() !== oldVal.toString()) {
                            $scope.init($scope.page.mask._layout, $element);
                        }
                    });

                    $scope.resetOpacity = function() {
                        $scope.page.mask.opacity = typeof $scope.page.mask.opacity === 'undefined' ? 70 : $scope.page.mask.opacity;
                        $element.find('canvas').css({
                            'opacity': $scope.page.mask.opacity / 100
                        });
                    };
                    //坚挺不透明度的彼岸花
                    $scope.$watch('page.mask.opacity', function(val) {
                        $scope.resetOpacity();
                        $scope.page.mask.opacity = typeof $scope.page.mask.opacity === 'undefined' ? 70 : $scope.page.mask.opacity;
                        $element.find('canvas').css({
                            'opacity': $scope.page.mask.opacity / 100
                        });
                    });
                    //当slideNext
                    $scope.onSlideChangeInit = function(activeIndex, $elem) {
                        $scope.init(Mask.slides[activeIndex].layout, $elem);
                    };
                    $scope.$on(events.flexCarouselClick, function(event, data) {
                        if (data.action === 'page-effect-init') {
                            $scope.init(Mask.slides[0].layout, $element);
                        }
                    });
                }
            };
            return directive;
        }
    ]);
});