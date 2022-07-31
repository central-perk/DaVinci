/**
 * [主页 banner]
 */
define(['app'], function (app) {
	app.directive('userIntro', ['$rootScope', 'config', '$alert', '$chat', 'FollowService', 'RelationService',
		function ($rootScope, config, $alert, $chat, FollowService, RelationService) {
			return {
				restrict: 'E',
				templateUrl: '/pages/user/intro/index.html',
				replace: true,
				link: function ($scope, $element, $attrs) {
					$scope.showMore = function() {
						$('.user-intro').toggleClass('open');
					};

					$scope.follow = function () {
						FollowService.create({
								userID: $scope.user._id
							})
							.then(function (data) {
								if (data.code === 200) {
									$scope.user.followID = data.msg;
									$scope.user.fansCount += 1;
									$alert.success('关注成功');
								} else {
									$alert.error(data.msg);
								}
							});
					};

					$scope.unfollow = function() {
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
						RelationService.createByUser($scope.user._id)
							.then(function (data) {
								if (data.code === 200) {
									$scope.user.friendStatus = 10;
									$alert.success(data.msg);
								} else {
									$alert.error(data.msg);
								}
							});
					};


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