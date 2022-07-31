define(['app'], function(app) {
	//交互作品页面缩略图
	app.directive('pgThumb', ['config', '$routeParams', '$pgAdd', '$rootScope', '$timeout', '$pgTemplateAdd', '$affirm', '$layerFactory', '$layerManage', '$layerClipboard', '$pgManage', '$stateParams', 'PageTemplateService', '$alert',
		function factory(config, $routeParams, $pgAdd, $rootScope, $timeout, $pgTemplateAdd, $affirm, $layerFactory, $layerManage, $layerClipboard, $pgManage, $stateParams, PageTemplateService, $alert) {
			var events = config.EVENTS,
				pagesPath = config.CPTS[config.FLYERS.categorys.interact].templates.components;
			var directive = {
				restrict: 'E',
				templateUrl: '/modules/pg-thumb/index.html',
				require: "ngModel",
				replace: true,
				priority: 10,
				scope: {
					ngModel: "=",
					pageNum: "@",
					curPageID: "@curpageid"
				},
				link: function($scope, $element, $attrs) {
					$scope.pageNum = $attrs.pageNum;
					$scope.page = $scope.ngModel;

					$scope.toEditPage = function() {
						if ($scope.whenSelected()) return;
						$scope.selectPage();
						// $event.stopPropagation();
						// return false;
					};

					//选中初始页面
					$scope.selectPage = function() {
						if ($scope.page.kind === 'custome') {
							$layerFactory.init($scope.page);
							$layerClipboard.init($scope.page);
							$layerManage.init($scope.page);
						}
						$pgManage.setCurPageID($scope.page.id);
						$pgManage.setCurPage($scope.page);
						$rootScope.$broadcast(events.pgThumbClick, {
							action: 'edit',
							page: $scope.page,
							pageNum: $scope.pageNum
						});

					};

					//是否被选中
					$scope.whenSelected = function() {
						return $scope.page && $scope.curPageID === $scope.page.id;
					};

					//设置初试显示的页面
					$scope.init = function() {
						//补丁
						if (!$scope.page.kind) {
							$scope.page.kind = 'std';
							if (!$scope.page.bg.style) {
								$scope.page.bg.style = {
									"repeat": "extrude",
									"position": "middle",
									"opacity": 100,
									"blur": 0
								};
							}
						}
						$scope.page.transition = $scope.page.transition || {};
						if (!$scope.page.transition.type) {
							$scope.page.transition.type = 'scale';
						}


						if (!$scope.page.fpscan) {
							$scope.page.fpscan = {
								"name": "fpscan",
								"enable": false,
								"title": "长按扫描",
								"fp": {
									"key": "black",
									"value": "/images/fpscan/fp_black.png",
									"customValue": "",
									"customSwitch": false
								},
								"bg": {
									"key": "1",
									"value": "/images/fpscan/bg1.jpg",
									"customValue": "",
									"customSwitch": false
								},
								"_layout": "default.html"
							};
						}

						if (!$scope.page.mask) {
							$scope.page.mask = {
								"name": "mask",
								"enable": false,
								"title": "",
								"key": "1",
								"value": "/images/masks/droplets.jpg",
								"customValue": "",
								"customSwitch": false,
								"_layout": "center.html",
								"drawPercent": 20
							};
						}
						//初始化被选中
						if ($scope.whenSelected()) {
							$timeout(function() {
								$scope.selectPage();
							}, 500);
						}
						var layers = $scope.page.layers;
						for (var i = layers.length - 1; i >= 0; i--) {
							$scope.animateDistanceFix(layers[i]);
						}
					};

					$scope.animateDistanceFix = function(layer) {
						var animate = layer.animate;
						if (!animate.distance) {
							if (animate.type === 'fadeIn') {
								animate.distance = 150;
							} else if (animate.type === 'moveIn') {
								if (animate.dir === 'fromLeft' || animate.dir === 'fromRight') {
									animate.distance = 640;
								} else if (animate.dir === 'fromTop' || animate.dir === 'fromBottom') {
									animate.distance = 750;
								}
							} else if (animate.type === 'bounceIn') {
								animate.distance = 1000;
							}
						}
					};
					$scope.init();

					var $mask = $element.find('.mask'),
						$pgUp = $element.find('.pg-up'),
						$pgDown = $element.find('.pg-down'),
						$subMenu = $element.find('.sub-menu');


					$scope.meThumb = function() {
						$element.addClass('mouse-enter');

						$pgUp.show();
						$pgDown.show();
					};
					$scope.mlThumb = function() {
						$element.removeClass('mouse-enter');

						$subMenu.removeClass('open');
						$pgUp.hide();
						$pgDown.hide();
					};

					$scope.mlRmBtn = function() {

						$mask.css({
							display: 'flex'
						});
					};

					$scope.rmPage = function($event) {
						$affirm.show({
							msg: '确认删除页面？',
							btnConfirm: {
								label: '删除'
							}
						}).then(function() {
							$scope.$emit(events.pgThumbClick, {
								action: 'remove',
								pageNum: $scope.pageNum
							});
						});

						$event.stopPropagation();
						return false;
					};

					//升级模版
					$scope.upgradePageTpl = function($event) {
						PageTemplateService.updateContent($scope.page.tplID, $scope.page).then(function(data) {
							if (data.code === 200) {
								$alert.success('页面模版升级成功');
							} else {
								$alert.error(data.msg);
							}
						});
					};

					$scope.removeIconRmActive = function($event) {
						var $ele = $($event.target)
							.parents('.icon-hover')
							.find('.icon-rm');
						if ($ele.hasClass('icon-rm-active')) {
							$ele.removeClass('icon-rm-active');
							$timeout(function() {
								$element.find('.icon-copy')
									.show();
							}, 300);
						}
						$event.stopPropagation();
						return false;
					};
					$scope.getPageViewTpl = function() {
						if ($scope.page) {
							var viewTpl = pagesPath + $scope.page._t + '/' + $scope.page._layout;
							return viewTpl;
						}
					};
					$scope.toAddPage = function($event, adjust) {
						$pgAdd.show(function(data) {
							$scope.$emit(events.pgAddClick, {
								action: 'add',
								page: data.page,
								newPageIndex: Number($scope.pageNum) + Number(adjust)
							});
						});
						$event.stopPropagation();
						return false;
					};

					$scope.canShowCopyIcon = function() {
						if ($scope.page._t === config.CPTS[config.FLYERS.categorys.interact].checkin._t) {
							return false;
						}
						return true;
					};
					$scope.copyPage = function($event) {
						$scope.$emit(events.pgThumbClick, {
							action: 'copy',
							page: $scope.page,
							pageNum: $scope.pageNum
						});
					};

					$scope.pgUp = function($event) {
						$scope.$emit(events.pgThumbClick, {
							action: 'pgUp',
							page: $scope.page,
							pageNum: $scope.pageNum
						});
						$event.stopPropagation();
						return false;
					};

					$scope.pgDown = function($event) {
						$scope.$emit(events.pgThumbClick, {
							action: 'pgDown',
							page: $scope.page,
							pageNum: $scope.pageNum
						});
						$event.stopPropagation();
						return false;
					};

					$scope.toCreatePageTeamplate = function() {
						$pgTemplateAdd.init({
							page: $scope.page,
							flyerID: $stateParams.flyerID
						});
					};

					$scope.toCreatePageCard = function() {
						// $pgCardAdd.init({
						// 	page: $scope.page
						// });
					};


					var allowEmails = config.USERS.centralperk;
					$scope.showSaveAs = function() {
						if (_.indexOf(allowEmails, $rootScope.user.email) !== -1) {
							return true;
						} else {
							return false;
						}
					};
				}
			};
			return directive;
		}
	]);
});
