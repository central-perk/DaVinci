define([
    'app'
], function (app) {
	app.service('$loading', ['config', '$http', '$modalService', '$q', '$modalStack',
        function (config, $http, $modalService, $q, $modalStack) {

			// 展示
			this.init = function (options) {
				options = options || {};
				var width = options.width || 450,
					windowClass = options.windowClass || '',
					onConfirm = options.onConfirm,
					delay = $q.defer();
				$modalService.show({
					templateUrl: '/services/loading/index.html',
					width: width,
					height: 100,
					windowClass: windowClass,
					backdrop: options.backdrop || 'true',
					controller: ['config', '$scope', '$rootScope', '$modalInstance', '$modalService',
                        function (config, $scope, $rootScope, $modalInstance, $modalService) {
							//关闭按钮
							$scope.close = function () {
								$modalInstance.close();
							};

							$scope.init = function () {};
                        }
                    ]
				});
				return delay.promise;
			};
			this.close = function () {
				$modalStack.dismissAll();
			};

        }
    ]);
});