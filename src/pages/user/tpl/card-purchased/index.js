define(['app'], function (app) {
	app.directive('userTplCardPurchased', ['$flyerConfig', 'FlyerService', '$tplView',
		function ($flyerConfig, FlyerService, $tplView) {
			return {
				restrict: 'E',
				templateUrl: '/pages/user/tpl/card-purchased/index.html',
				replace: true,
				require: 'ngModel',
				scope: {
					tpl: '=ngModel'
				},
				link: function ($scope, $element, $attrs) {

					// 使用模板
					$scope.createFlyer = function () {
						$flyerConfig.show({
							flyer: $scope.tpl,
							title: '新建作品',
							confirmBtn: {
								label: '确定'
							},
							hidePermissionEdit: true,
							action: 'create'
						});
					};

					// 预览
					$scope.preview = function() {
						$tplView.show({tpl: $scope.tpl});
					};
				}
			};
		}
	]);
});