define([
	'app',
	'modules/flyer-interact-editor/edit-area/bg/index',
	'modules/flyer-interact-editor/edit-area/animate/index',
	'modules/flyer-interact-editor/edit-area/effect/index',
	'modules/flyer-interact-editor/edit-area/arrange/index',
	'modules/flyer-interact-editor/edit-area/layer/index',
	'modules/flyer-interact-editor/edit-area/content/index',
	'modules/flyer-interact-editor/edit-area/style/index',
	'modules/flyer-interact-editor/edit-area/custome/index',
	'modules/input-number/index',
	'modules/input-color/index'
], function (app) {
	app.directive('fiEditArea', ['config', '$rootScope', '$layerClipboard', '$layerFactory', '$layerManage',
		function (config, $rootScope, $layerClipboard, $layerFactory, $layerManage) {
			var events = config.EVENTS,
				fiCptBasePath = '/components/interact/',
				fiPageCustomeBasePath = '/components/custome/';
			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/edit-area/index.html',
				replace: true,
				scope: {
					page: '=ngModel'
				},
				link: function ($scope, $ele, $attrs) {
					$ele.on('mousedown', function (event) {
						target = $(event.target);
						if (target.is("select") || target.is("input") || target.is("textarea")) {

						} else {
							event.preventDefault();
							event.stopPropagation();
						}
					});
					//监听 - 缩略图被点击
					var pgThumbClickOff = $rootScope.$on('pgThumbClick', function (event, data) {
						if (data && data.action === 'edit' && $scope.page) {
							if ($scope.page.kind === 'custome') {
								delete $scope.layer;
							} else if ($scope.page.kind === 'std' || !$scope.page.kind) {

							}
						}
					});

					// 图层编辑区域，图层被点击
					var layerQuickClickOff = $scope.$on('layerQuickClick', function ($event, data) {
						switch (data.action) {
						case 'remove':
							$layerManage.rmLayer(data.layer);
							break;
						case 'edit':
							$scope.layer = data.layer;
							break;
						case 'reindex':
							$scope.$apply(function () {
								$layerManage.reindexLayers(data.layers);
							});
							break;
						case 'display':
							data.layer.hidden = !data.layer.hidden || false;
							break;
						}
					});

					// layer上点击事件（包括右键菜单）
					var layerClickOff = $scope.$on(events.layerClick, function ($event, data) {
						switch (data.action) {
						case 'bringLayerTop':
							$layerManage.bringLayerTop(data.layer);
							break;
						case 'bringLayerBottom':
							$layerManage.bringLayerBottom(data.layer);
							break;
						case 'chooseLayer':
						case 'clickLayer':
							$scope.layer = data.layer;
							break;
						case 'removeLayer':
							$layerManage.rmLayer(data.layer);
							break;
						}
					});


					$scope.$on('pageBgClick', function (data) {
						delete $scope.layer;
					});

					$scope.$on('createPage', function () {
						delete $scope.layer;
					});


					$scope.$on('$destory', function () {
						layerClickOff();
						pgThumbClickOff();
					});
				}
			};
	}]);
});