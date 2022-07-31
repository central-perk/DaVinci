define([
	'app'
], function (app) {
	app.directive('layerSubmitSetting', ['config', '$rootScope', '$layerManage', '$validator', '$pgData', function (config, $rootScope, $layerManage, $validator, $pgData) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/content/layer-submit-setting/index.html',
			scope: {
				layer: "=ngModel"
			},
			link: function ($scope, $element, $attrs) {
				
				if($scope.layer.link && typeof $scope.layer.link.asSubmitBtn === 'undefined'){
					$scope.layer.link.asSubmitBtn = true;
				}

				// 设置为提交按钮，链接不可用
				$scope.$watch('layer.asSubmitBtn', function (newVal, oldVal) {
					if (newVal) {
						$scope.layer.link = $scope.layer.link|| {};
						$scope.layer.link.type = 'none';
					}
				});
			}
		};
	}]);
});