define([
	'app',
	'modules/flyer-interact-editor/top-bar/operate/index',
	'modules/flyer-interact-editor/top-bar/setting/index',
	'modules/flyer-interact-editor/top-bar/create-layer/index'
], function(app) {
	app.directive('fiTopBar', function() {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/top-bar/index.html',
			replace: true,
			controller: ['$rootScope', '$scope', 'config', function($rootScope, $scope, config) {
				var events = config.EVENTS;

				//监听 - 缩略图被点击
				$rootScope.$on(events.pgThumbClick, function(event, data) {
					if (data) {
						if (data.action === 'edit') {
							if ($scope.page && $scope.page.kind) {
								$scope.page = data.page;
							}
						}
					}
				});

			}]
		};
	});
});
