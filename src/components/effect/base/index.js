define(['app'], function(app, config) {
    app.directive('pgEffectBase', ['$compile', 'config', '$validator', '$utils',
        function factory($compile, config, $validator, $utils) {
            var events = config.EVENTS,
                effectCptsPath = config.CPTS[config.FLYERS.categorys.interact].templates.effectComponents;
            var directive = {
                restrict: 'E',
                require: "ngModel",
                replace: "true",
                scope: {
                    page: "=ngModel",
                    env: "@env"
                },
                controller: ['$scope', '$http', '$q', '$templateCache',
                    function($scope, $http, $q, $templateCache) {
                        $scope.PICSIZE = config.PICSIZE.interact;
                        var slides,
                            originPicShape,
                            tpls = {},
                            effectType;
                        var Base = function(options) {
                            slides = angular.copy(options.slides);
                            $scope.page = options.page;
                            $scope.page.effect = $scope.page.effect || {};
                            effectType = $scope.page.effect.name || 'mask';
                            $scope.init();
                        };

                        Base.prototype.savePage = function() {
                            $scope.$emit(events.pageEditorClick, {
                                action: 'savePage',
                                page: $scope.page
                            });
                        };

                        this.Base = Base;

                        //设计时－单页面预览
                        $scope.init = function() {
                            var layouts = [];
                            for (var i = 0; i < slides.length; i++) {
                                layouts.push($scope.getEffectViewTpl(slides[i].layout));
                            }
                            $scope.layouts = layouts;

                            $scope.layout = $scope.getEffectViewTpl($scope.page[effectType]._layout || 'default.html');
                            var flexCarouselClickOff = $scope.$on(events.flexCarouselClick, function($event, data) {
                                if (data) {
                                    if (data.action === 'page-effect-finshSlide') {
                                        $scope.$apply(function() {
                                            $scope.page[effectType]._layout = slides[data.index].layout;
                                        });
                                    }
                                }
                            });

                            $scope.$on('$destroy', function() {
                                flexCarouselClickOff();
                            });
                        };

                        $scope.getEffectViewTpl = function(_layout) {
                            if (_layout) {
                                return effectCptsPath + effectType + '/' + _layout;
                            } else {
                                return effectCptsPath + effectType + '/' + $scope.page[effectType]._layout; //+ this.page._layout
                            }
                        };


                        //获取模版
                        $scope.getLayoutTpl = function(layoutPath) {
                            var delay = $q.defer();
                            if (tpls[layoutPath]) {
                                var layoutTpl = '<div class="page-' + effectType + ' ' + $scope.getEffectLayout(layoutPath) + '">' + tpls[layoutPath] + '</div>';
                                delay.resolve(layoutTpl);
                            } else {
                                $http.get(layoutPath)
                                    .then(function(result) {
                                        var layoutTpl = result.data;
                                        tpls[layoutPath] = layoutTpl;
                                        $templateCache.put(layoutPath, layoutTpl);
                                        layoutTpl = '<div class="page-' + effectType + ' ' + $scope.getEffectLayout(layoutPath) + '">' + layoutTpl + '</div>';
                                        delay.resolve(layoutTpl);
                                    });
                            }
                            return delay.promise;
                        };


                        $scope.getEffectLayout = function(_layout) {
                            var array = _layout.split('\/');
                            return array[array.length - 1].split('.')[0];
                        };

                        $scope.getEffectEditTpl = function() {
                            return effectCptsPath + effectType + '/edit.html';
                        };
                    }
                ],
                link: function($scope, $element, $attrs) {
                    //接收编辑环境变量，dt-设计,et-编辑
                    if (!$scope.page) return;
                    $scope.page.effect = $scope.page.effect || {};
                    var effectType = $scope.page.effect.name || 'mask';
                    if (!$scope.page.effect.enable && $scope.env !== 'et') {
                        return;
                    }
                    var html = '<pg-effect-' + effectType + '>';
                    html += '</pg-effect-' + effectType + '>';
                    var e = angular.element(html);
                    $element.append(e);
                    $compile(e)($scope);

                }
            }
            return directive;
        }
    ]);
});