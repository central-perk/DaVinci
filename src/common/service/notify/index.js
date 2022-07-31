// 消息提示弹出层
define(['app'], function(app) {
	app.factory('$notify', [ '$modalService', function($modalService) {
		var defaultOptions = {
			width: 300,
			height: 220,
			templateUrl: '/common/service/notify/index.html',
			windowClass: 'modal-notify modal-rect'
		};

		return {
			show: function(options) {
				options = _.merge(defaultOptions, options);
				options.controller = ['$scope', '$rootScope', '$modalInstance', '$modalService',
					function($scope, $rootScope, $modalInstance, $modalService) {
						$scope.title = options.title;
						$scope.desc = options.desc;

						$scope.dismiss = function() {
							$modalInstance.dismiss();
						};
					}
				];
				return $modalService.show(options);
			}
		};
	}]);
});