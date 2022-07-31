define(['app'], function (app) {
	app.directive('tvTpl', ['config', '$rootScope', '$flyerConfig', 'FlyerService', 'TplService', '$alert',
		function (config, $rootScope, $flyerConfig, FlyerService, TplService, $alert) {
			return {
				restrict: 'E',
				templateUrl: '/common/service/tpl-view/tpl/index.html',
				replace: true,
				scope: {
					tpl: '=ngModel'
				},
				link: function ($scope, $ele, $attrs) {
					$rootScope.$broadcast('viewPreviewClick', {
						tplID: $scope.tpl._id
					});


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

					$scope.buy = function (tpl) {
						window.location.href = '/api/templates/' + tpl._id + '/buy';
					};

					$scope.buyout = function (tpl) {
						window.location.href = '/api/templates/' + tpl._id + '/buyout';
					};

					$scope.exchange = function () {
						TplService.exchange($scope.tpl._id).then(function (data) {
							if (data.code === 200) {
								return window.open('/u/' + $rootScope.user._id + '/tpl', '_self');
							} else {
								$alert.error(data.msg);
							}
						});
					};
				}
			};
		}
	]);
});