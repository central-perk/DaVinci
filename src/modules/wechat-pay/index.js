/**
 * 微信支付
 *
 */
define(['app'], function (app) {
	app.directive('wechatPay', ['$rootScope', '$modalService', '$timeout',
        function factory($rootScope, $modalService, $timeout) {
			var directive = {
				scope: {
					setting: "=setting"
				},
				link: function ($scope, $element, $attrs, $transclude, ngModel) {

					$element.bind('click', function ($event) {
						var setting = $scope.setting;
						$modalService.show({
							templateUrl: '/modules/wechat-pay/index.html',
							width: 600,
							height: 360,
							marginTop: 300,
							controller: ['config', '$scope', '$rootScope', '$modalInstance', '$http', '$alert', '$validator', '$utils',
                                function (config, $scope, $rootScope, $modalInstance, $http, $alert, $validator, $utils) {
									$scope.setting = setting;
									$scope.qrcode = {
										done: false,
										link: ''
									}
									$scope.init = function () {
										$scope.qrcode.done = false;
										$http({
												method: 'post',
												url: '/api/wechat/native/pay',
												data: setting
											})
											.success(function (data) {
												if (data.code === 200) {
													$scope.qrcode.link = data.msg.url;
												} else {
													$alert.error(data.msg);
												}
												$scope.qrcode.done = true;
											}).error(function () {
												$scope.qrcode.done = true;
											});
									};
									$scope.init();
									$scope.close = function () {
										$modalInstance.close();
									};

                                }
                            ]
						});
					});
				}
			};
			return directive;
        }
    ]);
});