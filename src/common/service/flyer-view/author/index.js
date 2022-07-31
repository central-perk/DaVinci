define(['app'], function (app) {
	app.directive('fvAuthor', ['config', '$rootScope', '$state', '$alert', '$chat', 'RelationService', 'FlyerService', 'FollowService',
		function (config, $rootScope, $state, $alert, $chat, RelationService, FlyerService, FollowService) {
			return {
				restrict: 'E',
				templateUrl: '/common/service/flyer-view/author/index.html',
				replace: true,
				scope: {
					flyerId: '@'
				},
				link: function ($scope, $ele, $attrs) {
					$scope.flyerID = $scope.flyerId;

					FlyerService.getUser($scope.flyerID)
						.then(function (data) {
							if (data.code === 200) {
								$scope.user = data.msg.user;
								$scope.user.isAuthor = $rootScope.user._id === $scope.user._id;
								$scope.flyers = data.msg.flyers;
							}
						});

					// 预览
					$scope.preview = function (flyer) {
						$rootScope.$broadcast('viewPreviewClick', {
							flyer: flyer
						});
					};


					// 关注
					$scope.follow = function () {
						FollowService.create({
							userID: $scope.user._id
						}).then(function (data) {
							if (data.code === 200) {
								$scope.user.followID = data.msg;
								$scope.user.fansCount += 1;
								$alert.success('关注成功');
							} else {
								$alert.error(data.msg);
							}
						});
					};

					// 取消关注
					$scope.unfollow = function () {
						FollowService.remove($scope.user.followID)
							.then(function (data) {
								if (data.code === 200) {
									$scope.user.followID = null;
									$scope.user.fansCount -= 1;
									$alert.success(data.msg);
								} else {
									$alert.error(data.msg);
								}
							});
					};

					// 加好友
					$scope.apply = function () {
						RelationService.createByUser($scope.user._id).then(function (data) {
							if (data.code === 200) {
								$scope.user.friendStatus = 10;
								$alert.success(data.msg);
							} else {
								$alert.error(data.msg);
							}
						});
					};

					$scope.applying = function () {
						$alert.success('您的友好意愿已送达');
					};

					$scope.unapply = function () {
						$alert.success('你们已经是好友关系');
					};

					// 私信
					$scope.chat = function () {
						$chat.show({
							user: $scope.user
						});
					};
				}
			};
		}
	]);
});