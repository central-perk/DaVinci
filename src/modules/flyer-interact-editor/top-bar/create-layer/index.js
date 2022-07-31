define(['app'], function(app) {
	app.directive('fiCreateLayer', ['config', '$rootScope', function(config, $rootScope) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/top-bar/create-layer/index.html',
			replace: true,
			scope: {
				layers: '=ngModel'
			},
			controller: ['$scope', 'config', '$rootScope', '$utils', '$layerFactory', function($scope, config, $rootScope, $utils, $layerFactory) {
				var events = config.EVENTS;

				$scope.svgs = [{
					src: '/images/svg/1.svg',
				}, {
					src: '/images/svg/2.svg',
				}, {
					src: '/images/svg/3.svg',
				}, {
					src: '/images/svg/4.svg',
				}, {
					src: '/images/svg/5.svg',
					height: 144
				}, {
					src: '/images/svg/6.svg',
				}, {
					src: '/images/svg/7.svg',
				}, {
					src: '/images/svg/8.svg',
				}, {
					src: '/images/svg/9.svg',
					height: 106
				}, {
					src: '/images/svg/10.svg',
				}, {
					src: '/images/svg/11.svg',
					height: 186
				}, {
					src: '/images/svg/12.svg',
					height: 213
				}];

				$scope.getSvgStyle = function(link) {
					return {
						'-webkit-mask-image': 'url(' +  link + ')'
					};
				};

				// 创建图片层
				$scope.createImage = function() {
					$layerFactory.createImage();
					$scope.savePage();
				};

				// 创建图片层
				$scope.createText = function() {
					$layerFactory.createText();
					$scope.savePage();
				};

				// 创建输入框
				$scope.createIbox = function() {
					$layerFactory.createIbox();
					$scope.savePage();
				};

				// 创建地图
				$scope.createMap = function() {
					$layerFactory.createMap();
					$scope.savePage();
				};

				// 创建视频
				$scope.createVideo = function() {
					$layerFactory.createVideo();
					$scope.savePage();
				};

				// 创建幻灯片
				$scope.createSlider = function() {
					$layerFactory.createSlider();
					$scope.savePage();
				};

				$scope.createShape = function(url) {
					$layerFactory.createShape(url);
					$scope.savePage();
				};

				$scope.savePage = function savePage() {
					$scope.$emit(events.pageEditorClick, {
						action: 'savePage',
						page: $scope.page
					});
				};

				$scope.btnText = {};
				$scope.btnImage = {};
				$scope.btnIbox = {};
				$scope.btnMap = {};
				$scope.btnVideo = {};

				//监听 - 缩略图被点击
				$rootScope.$on(events.pgThumbClick, function(event, data) {
					if (data && data.action === 'edit') {
						if (!data.page.kind || data.page.kind === 'std') {
							$scope.btnText.disabled = true;
							$scope.btnImage.disabled = true;
							$scope.btnIbox.disabled = true;
							$scope.btnMap.disabled = true;
							$scope.btnVideo.disabled = true;
						} else {
							$scope.page = data.page;
							$scope.btnText.disabled = false;
							$scope.btnImage.disabled = false;
							$scope.btnIbox.disabled = false;
							$scope.btnMap.disabled = false;
							$scope.btnVideo.disabled = false;
						}
					}
				});
			}]
		};
	}]);
});
