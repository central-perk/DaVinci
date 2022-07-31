define([
	'app',
	'pages/user/collect/card/index',
	'pages/tpl-center/card/index',
], function (app, pageConfig) {
	app.controller('UserCollectController', ['$scope', '$rootScope', '$alert', '$affirm', 'CollectService',
		function ($scope, $rootScope, $alert, $affirm, CollectService) {
			var userID = $scope.user._id; // 访问目标用户的 userID

			$scope.init = function() {
				$scope.loading = false;
				$scope.query = {
					userID: $scope.user._id
				};
			};

			// 获取作品收藏列表
			$scope.listCollectFlyer = function() {
				listCollect('listFlyer');
			};

			// 获取模板收藏列表
			$scope.listCollectTpl = function() {
				listCollect('listTpl');
			};

			function listCollect(operate) {
				CollectService[operate]($scope.query)
					.then(function(data) {
						if (data.code === 200) {
							$scope.loading = false;
							$scope.collects = $scope.collects.concat(data.msg.collects || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							$alert.error(data.msg);
						}
					});
			}

			$scope.clearCollect = function() {
				$scope.collects = [];
				delete $scope.count;
				delete $scope.next;
				delete $scope.nextPage;
			};

			// 删除收藏
			$scope.onUncollect = function(data) {
				var collectID = data.collectID;
				_.remove($scope.collects, {_id: collectID});
			};

			// 加载更多
			$scope.loadMore = function(opt) {
				$scope.query.page = $scope.nextPage;
				$scope[opt]();
			};
		}
	]);
});