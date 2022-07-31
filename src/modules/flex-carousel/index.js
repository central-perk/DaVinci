/**
 *  切换布局
 *
 */
define(['app'], function (app) {
	app.directive('flexCarousel', ['config', '$timeout', '$http', '$compile',
        function factory(config, $timeout, $http, $compile) {
			var events = config.EVENTS,
				animates = config.ANIMATES,
				types = config.CPTS[config.FLYERS.categorys.static].types,
				cptsPath = config.CPTS[config.FLYERS.categorys.static].templates.components;
			var directive = {
				restrict: 'E', //指令的使用方式，包括标签，属性，类，注释
				templateUrl: '/modules/flex-carousel/index.html', //从指定的url地址加载模板
				replace: true,
				scope: false,
				link: function ($scope, $element, $attrs) {
					var $inner = $element.find('.carousel-inner');
					var name = $attrs.name || '';
					var tpls = {};
					var loading = false;
					var layouts = $scope.layouts;
					var layout = $scope.layout;
					var width = $attrs.distance || 700;
					//动画执行速度
					var speed = $attrs.speed || 500;
					$scope.next = function ($event) {
						var nextIndex = $scope.getNextIndex();
						$scope.select(nextIndex, 'right');
						$event.stopPropagation();
						return false;
					};
					$scope.prev = function ($event) {
						var prevIndex = $scope.getPrevIndex();
						$scope.select(prevIndex, 'left');
						$event.stopPropagation();
						return false;
					};
					//选择切换
					$scope.select = function (layoutIndex, direction) {
						if ($scope.loading) return;
						$scope.loading = true;
						layout = layouts[layoutIndex];
						$scope.getLayoutTpl(layout)
							.then(function (tpl) {
								var tpl = '<div class="slide">' + tpl + '</div>';
								var layoutTpl = angular.element(tpl);
								var $elem = $compile(layoutTpl)($scope);
								$scope.$emit(events.flexCarouselClick, {
									action: name + 'startSlide',
									index: layoutIndex
								});
								$element.addClass('sliding');

								//判断方向
								if (direction === 'right') {
									//向左滑动
									$inner.append($elem);
									$scope._onSlideChangeInit($inner.find('>div')
										.eq(1));
									$inner.find('>div')
										.eq(0)
										.animate({
											'margin-left': '-=' + width
										}, speed, 'swing', function () {
											$(this)
												.remove();
											$element.removeClass('sliding');
											$scope.loading = false;
											$scope.finshSlide(layoutIndex);
										});
								} else {
									//向右滑动
									$elem.css({
										'margin-left': -width
									});
									$inner.prepend($elem);
									$scope._onSlideChangeInit($($elem));
									$inner.find('>div')
										.eq(0)
										.animate({
												'margin-left': '+=' + width
											}, speed, 'swing',
											function () {
												$inner.find('>div')
													.eq(1)
													.remove();
												$element.removeClass('sliding');
												$scope.loading = false;
												$scope.finshSlide(layoutIndex);
											});

								}
							});
					}

					//通知结束滑动
					$scope.finshSlide = function (index) {
						$scope.$emit(events.flexCarouselClick, {
							action: name + 'finshSlide',
							index: index
						});
					};
					//获取当前布局索引
					$scope.getCurIndex = function () {
						for (var i = 0; i < layouts.length; i++) {
							if (layout === layouts[i]) {
								return i;
							}
						};
					}

					//下一页索引
					$scope.getNextIndex = function () {
						var curIndex = $scope.getCurIndex(),
							nextIndex = curIndex + 1;
						if (nextIndex > layouts.length - 1) {
							nextIndex = 0;
						}
						return nextIndex;
					}

					//上一页索引
					$scope.getPrevIndex = function () {
						var curIndex = $scope.getCurIndex(),
							prevIndex = curIndex - 1;;
						if (prevIndex < 0) {
							prevIndex = layouts.length - 1;
						}
						return prevIndex;
					}

					$scope.isActive = function (_layout) {
						return layout === _layout;
					}

					//初始化
					$scope.getLayoutTpl(layout)
						.then(function (tpl) {
							var tpl = '<div class="slide">' + tpl + '</div>';
							var layoutTpl = angular.element(tpl);
							var $elem = $compile(layoutTpl)($scope);
							$inner.append($elem);
							$scope.$emit(events.flexCarouselClick, {
								action: name + 'init'
							});
						});

					$scope._onSlideChangeInit = function ($elem) {
						if ($scope.onSlideChangeInit) {
							$scope.onSlideChangeInit($scope.getCurIndex(), $elem);
						}

					};
				}
			};
			return directive;
        }
    ]);
});