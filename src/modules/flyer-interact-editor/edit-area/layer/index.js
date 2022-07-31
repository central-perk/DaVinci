// 自定义页面--图层编辑
define(['app'], function (app) {
	app.directive('fiEditLayer', ['config', '$rootScope', '$layerManage', function (config, $rootScope, $layerManage) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/layer/index.html',
			scope: {
				layers: "=ngModel",
				layer: '='
			},
			link: function ($scope, $element, $attrs) {

				$scope.layers = $layerManage.resortLayers($scope.layers);


				// $scope.layerOperationClick = function(operation) {
				// 	$scope.$emit('layerOperationClick', {
				// 		action: operation,
				// 		layer: $scope.layer
				// 	});
				// };

				$scope.layerQuickClick = function ($event, layer, operation) {
					$scope.$emit('layerQuickClick', {
						action: operation,
						layer: layer
					});
					// $event.preventDefault();
					// $event.stopPropagation();
					// return false;
				};

				$scope.isText = $layerManage.isText;
				$scope.isImage = $layerManage.isImage;
				$scope.isIbox = $layerManage.isIbox;
				$scope.isMap = $layerManage.isMap;
				$scope.isVideo = $layerManage.isVideo;
				$scope.isSlider = $layerManage.isSlider;
				$scope.isShape = $layerManage.isShape;

				$scope.getText = function (layer) {
					try {
						var html = $(layer.content.text)
							.text();
						if (html === null || html === '') {
							return layer.name;
						} else {
							return html;
						}
					} catch (error) {
						return '文本';
					}
				};

				$scope.sortableOptions = {
					stop: function (e, ui) {
						$scope.$emit('layerQuickClick', {
							action: 'reindex',
							layers: $scope.layers
						});
					}
				};

			}
		};
	}]);
});
