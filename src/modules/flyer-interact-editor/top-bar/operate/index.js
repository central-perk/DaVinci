define(['app'], function (app) {
	app.directive('fiOperate', ['config',
		function (config) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/top-bar/operate/index.html',
				replace: true,
				scope: true,
				link: function ($scope, $ele, $attrs) {
					$scope.update = function () {
						$scope.$emit(events.topBarClick, {
							action: 'update'
						});
					};
					$scope.preview = function () {
						$scope.$emit(events.topBarClick, {
							action: 'preview'
						});
					};
					$scope.publish = function () {
						$scope.$emit(events.topBarClick, {
							action: 'publish'
						});
					};
					$scope.jump = function () {
						$scope.$emit(events.topBarClick, {
							action: 'jump'
						});
					};
					$scope.sumbit = function () {
						$scope.$emit(events.topBarClick, {
							action: 'sumbit'
						});
					}
				}
			};
		}
	]);
});