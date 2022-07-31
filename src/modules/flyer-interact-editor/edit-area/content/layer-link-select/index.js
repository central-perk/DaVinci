define([
	'app'
], function (app) {
	app.directive('layerLinkSelect', ['config', '$rootScope', '$layerManage', '$validator', '$pgData', function (config, $rootScope, $layerManage, $validator, $pgData) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/content/layer-link-select/index.html',
			scope: {
				layer: "=ngModel"
			},
			link: function ($scope, $element, $attrs) {
				$scope.linkTypes = config.FI_EDITOR.LAYER.link.types;
				$scope.placeholder = config.FI_EDITOR.LAYER.link.placeholder;
				$scope.error = {};
				if(!$scope.layer) return;
				if($scope.layer.link && typeof $scope.layer.link.openNewTab === 'undefined'){
					$scope.layer.link.openNewTab = false;
				}
				//链接输入框值监听
				$scope.$watch('setting.linkVal', function (newVal, oldVal) {
					if ($scope.layer.active) {
						checkLinkVal(newVal);
					}
				});

				var checkLinkVal = function (newVal) {
					if ($scope.setting.linkType === 'tel') {
						if ($validator.validateNumber(newVal)) {
							$scope.layer.link.tel = newVal;
							$scope.error.type = null;
						} else {
							$scope.error.type = 'tel';
						}
					} else if ($scope.setting.linkType === 'web') {
						if ($validator.validateLink(newVal)) {
							$scope.layer.link.web = newVal;
							$scope.error.type = null;
						} else {
							$scope.error.type = 'web';
						}
					} else if ($scope.setting.linkType === 'page') {
						$scope.layer.link.pageID = newVal;
					} else {
						$scope.error = {};
					}
				};

				//链接类型监听
				$scope.$watch('setting.linkType', function (newVal, oldVal) {
					if (newVal) {
						if (newVal !== $scope.error.type) {
							$scope.error.type = null;
						}
						if ($scope.layer.active) {
							$scope.layer.link.type = newVal;
							$scope.setting.linkVal = $layerManage.getLinkVal($scope.layer.link);
							if ($scope.layer.link.type === 'none') {
								$scope.error = {};
							} else if ($scope.layer.link.type === 'page') {
								$scope.pages = $pgData.getSelectPages();
								if (!$scope.layer.link.pageID) {
									$scope.layer.link.pageID = $scope.pages[0].id;
								}
								$scope.setting.linkVal = $layerManage.getLinkVal($scope.layer.link);
							}
						}
					}
				});


				//初始化
				var init = function () {
					$scope.setting = {};
					$scope.layer.link = $scope.layer.link || {};
					$scope.setting.linkType = $scope.layer.link.type || 'none';
					$scope.setting.linkVal = $layerManage.getLinkVal($scope.layer.link);
				};
				if ($scope.layer) {
					init();
				}

		
			}
		};
	}]);
});