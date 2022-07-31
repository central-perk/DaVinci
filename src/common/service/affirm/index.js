define(['app'], function(app) {
	app.service('$affirm', ['$modalService', function($modalService) {
		this.show = function(option) {
			var defaultOption = {
				width: 260,
				height: 120,
				templateUrl: '/common/service/affirm/index.html',
				windowClass: 'affirm',
				btnConfirm: {
					label: '确认',
					hide: false
				},
				btnCancel: {
					label: '取消',
					hide: false
				},
				msg: 'How are you?'
			};
			option = _.merge(defaultOption, option);
			option.controller = ['$scope', '$rootScope', '$modalInstance', function($scope, $rootScope, $modalInstance) {
				$scope.msg = option.msg;
				$scope.btnCancel = option.btnCancel;
				$scope.btnConfirm = option.btnConfirm;

				$scope.confirm = function() {
					$modalInstance.close();
				};

				$scope.close = function() {
					$modalInstance.dismiss();
				};
			}];
			return $modalService.show(option);
		};
	}]);
});
