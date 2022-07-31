define([
	'app',
], function (app, pageConfig) {
	app.controller('UserFollowController', ['$scope', '$rootScope', '$state', 'config', '$alert', '$http', '$affirm', 'FollowService',
		function ($scope, $rootScope, $state, config, $alert, $http, $affirm, FollowService) {
			var events = config.EVENTS,
				userID = $scope.user._id; // 访问目标用户的 userID

			$scope.init = function () {
				$scope.loading = false;
				$scope.query = {
					userID: $scope.user._id
				};
				$scope.follows = [];
			};

			$scope.listFollow = function () {
				if ($scope.nextPage) $scope.loading = true;
				$http({
						method: 'get',
						url: '/api/follows',
						params: $scope.query
					})
					.success(function (data) {
						if (data.code === 200) {
							$scope.loading = false;
							$scope.follows = $scope.follows.concat(data.msg.follows || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// 解除好友
			$scope.rmFollow = function (user) {
				$affirm.show({
					msg: '确定取消关注？',
					btnConfirm: {
						label: '确定'
					},
				}).then(function () {
					var followID = _.result(_.find($scope.follows, {user: user}), '_id');
					FollowService.remove(followID)
						.then(function (argument) {
							if (data.code === 200) {
								_.remove($scope.follows, {user: user});
								$scope.count = $scope.follows.length;
								$alert.success(data.msg);
							} else {
								$alert.error(data.msg);
							}
						});
				});
			};

			// 加载更多
			$scope.loadMore = function () {
				$scope.query.page = $scope.nextPage;
				$scope.listFollow();
			};

		}
	]);
});