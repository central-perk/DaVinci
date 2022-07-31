/**
 * 交互作品 页面展示容器
 * 监听 - 缩略图被点击
 * 监听 - 主题，背景，色彩，文字选择器被hover
 * 监听 - 编辑区区域发生，hover

 * 监听 - 编辑区域点击
 */
define(['app'], function (app) {
	//作品相关操作容器
	var layouts = {};
	app.directive('pgVessel', ['config', '$http', '$alert', '$rootScope', function factory(config, $http, $alert, $rootScope) {
		var events = config.EVENTS;
		var CONFIG_CPTS_INTERACT = config.CPTS[config.FLYERS.categorys.interact];
		var directive = {
			restrict: 'AE',
			templateUrl: '/modules/pg-vessel/index.html',
			replace: true,
			controller: ['$scope', '$timeout', function ($scope, $timeout) {
				var curPage;


				//监听 - 编辑区域点击
				var pageEditorClickOff = $scope.$on(events.pageEditorClick, function ($event, data) {
					if (data) {

						if (data.action === 'editEffect') {
							$('.mdl-pg-vessel').addClass('edit-effect');
						}

						if (data.action === 'notEditEffect') {
							$('.mdl-pg-vessel').removeClass('edit-effect');
						}
					}
				});

				var pgThumbClickOff = $scope.$on(events.pgThumbClick, function ($event, data) {
					if (data) {
						if (data.action === 'edit') {
							$scope.page = data.page;
							$scope.vessels = [{}];
						}
					}
				});

				var previewing = false;
				$scope.previewPage = function () {
					var now = new Date();

					if (!previewing) {
						previewing = true;
						$rootScope.$broadcast(events.pgVesselClick, {
							action: 'preview',
							page: $scope.page
						});
						setTimeout(function () {
							previewing = false;
						}, 1500);
					}
				};

				$scope.$on('$destory', function () {
					pageEditorClickOff();
				});

            }]
		};
		return directive;
    }]);
});