define([
	'app',
], function (app, pageConfig) {
	app.controller('UserTpl_Controller', ['$scope', '$rootScope', '$state', 'config', '$alert', 'UserService', '$tplConfig', 'TplService',
		function ($scope, $rootScope, $state, config, $alert, UserService, $tplConfig, TplService) {
			var events = config.EVENTS,
				userID = $scope.user._id; // 访问目标用户的 userID


			$scope.init = function() {
				$scope.loading = false;
				$scope.query = {
					userID: userID
				};
			};

			$scope.listTpl = function() {
				if ($scope.nextPage) $scope.loading = true;
				UserService.listTpl(userID, $scope.query)
					.then(function(data) {
						if (data.code === 200) {
							$scope.loading = false;
							$scope.tpls = $scope.tpls.concat(data.msg.templates || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			$scope.listTplByQuery = function(filter) {
				delete $scope.next;
				delete $scope.count;
				delete $scope.nextPage;
				$scope.tpls = [];
				$scope.listTpl();
			};



			// 加载更多
			$scope.loadMore = function() {
				$scope.query.page = $scope.nextPage;
				$scope.listTpl();
			};

		}
	]);
});