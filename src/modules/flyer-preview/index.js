/**
 *  作品预览
 *  监听消息 - 预览按钮被点击
 */
define(['app'], function (app) {
	app.directive('flyerPreview', ['config',
        function factory(config) {
			var events = config.EVENTS;
			var directive = {
				restrict: 'E',
				templateUrl: '/modules/flyer-preview/index.html',
				replace: true,
				scope: {},
				controller: ['$scope', '$rootScope', 'config', '$loading',
                    function ($scope, $rootScope, config, $loading) {
						var flyerID,
							$iframe = document.getElementById("iframe-preview");

						var listenPreviewOff = $rootScope.$on(events.designTbClick, function ($event, data) {
							if (data && data.action === 'preview' && data.flyer && data.flyer.category == 10) {
								$scope.previewing = false;
								flyerID = data.flyerID;
								$scope.preview_url = '/f/' + data.flyerID + '/preview';
								$scope.device = data.device || 'pc';
								// loading
								$loading.init({
									width: 200,
									backdrop: 'static',
									windowClass: 'svs-loading'
								});

								$iframe.onload = function () {
									$loading.close();
									$scope.previewing = true;
								};
							}
						});

						//改变设备
						$scope.deviceChange = function (device) {
							$scope.device = device;
						};

						$scope.hidePreview = function () {
							$scope.preview_url = ' '; // 必须是空格，否则src无法清空
							$scope.previewing = false;
							$scope.$emit(events.designTbClick, {
								action: 'hidePreview'
							});
							$iframe.onload = null;
						};
						$scope.$on('$destroy', function () {
							listenPreviewOff();
						});
                    }
                ]
			};
			return directive;
        }
    ]);
});