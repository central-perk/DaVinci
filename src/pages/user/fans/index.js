define(['app', ], function(app, pageConfig) {
	app.controller('UserFansController', ['$scope', '$rootScope', 'config', '$alert','$affirm', 'FansService', 'UserService', 'FollowService',
		function($scope, $rootScope, config, $alert, $affirm, FansService, UserService, FollowService) {
			var events = config.EVENTS,
				userID = $scope.user._id; // 访问目标用户的 userID

			$scope.init = function() {
				$scope.loading = false;
				$scope.query = {
					userID: $scope.user._id
				};
				$scope.fans = [];
				$scope.removeNewCount();
			};

			$scope.removeNewCount = function() {
				if (!$scope.user.newFansCount) return;
				UserService.removeNewCount(userID, 1)
					.then(function(data) {
						if (data.code === 200) {
							delete $scope.user.newFansCount;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// 获取粉丝列表
			$scope.listFans = function() {
				if ($scope.nextPage) $scope.loading = true;
				FansService.list($scope.query)
					.then(function(data) {
						if (data.code === 200) {
							$scope.loading = false;
							$scope.fans = $scope.fans.concat(data.msg.fans || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// // 移除粉丝
			// $scope.rmFans = function(user) {
			// 	var fansID = _.result(_.find($scope.fans, {user: user}), '_id');
			// 	$affirm.init({
			// 		msg: '确定移除粉丝？',
			// 		onConfirm: function () {
			// 			FansService.remove(fansID)
			// 				.then(function (argument) {
			// 					if (data.code === 200) {
			// 						_.remove($scope.fans, {user: user});
			// 						$alert.success(data.msg);
			// 					} else {
			// 						$alert.error(data.msg);
			// 					}
			// 				});
			// 		}
			// 	});
			// };

			$scope.follow = function (fan) {
				FollowService.create({
						userID: fan.user._id
					})
					.then(function (data) {
						if (data.code === 200) {
							fan.followID = data.msg;
							$scope.user.followCount += 1;
							$alert.success('关注成功');
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// 加载更多
			$scope.loadMore = function() {
				$scope.query.page = $scope.nextPage;
				$scope.listFans();
			};
		}
	]);
});