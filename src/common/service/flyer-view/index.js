define([
	'app',
	'common/service/flyer-view/flyer/index',
	'common/service/flyer-view/author/index',
	'common/service/flyer-view/show/index',
	'common/service/flyer-view/reply/index',
], function(app) {
	app.factory('$flyerView', [ '$modalService', function($modalService) {
		var defaultOption = {
			width: 1100,
			height: 700,
			templateUrl: '/common/service/flyer-view/index.html',
			windowClass: 'modal-flyer-view modal-rect'
		};

		return {
			show: function(option) {
				var flyerID = option.flyer._id;
				option = _.merge(defaultOption, option);
				option.resolve = {
					flyer: ['FlyerService', '$alert', function (FlyerService, $alert) {
						return FlyerService.getDetail(flyerID)
							.then(function (data) {
								if (data.code === 200) {
									return data.msg;
								} else {
									$alert.error(data.msg);
								}
							});
					}]
				};
				option.controller = ['$scope', '$rootScope', '$modalInstance', '$alert', 'LikeService', 'CollectService', 'flyer',
					function($scope, $rootScope, $modalInstance, $alert, LikeService, CollectService, flyer) {
						$scope.flyer = flyer;
						$scope.tab = {};

						// 赞
						$scope.like = function () {
							LikeService.create({
								modelID: flyerID,
								category: 1
							}).then(function (data) {
								if (data.code === 200) {
									$scope.flyer.likeID = data.msg;
									$alert.success('点赞成功');
								} else {
									$alert.error(data.msg);
								}
							});
						};

						// 取消赞
						$scope.unlike = function () {
							LikeService.remove($scope.flyer.likeID)
								.then(function (data) {
									if (data.code === 200) {
										delete $scope.flyer.likeID;
										$alert.success(data.msg);
									} else {
										$alert.error(data.msg);
									}
								});
						};

						// 收藏
						$scope.collect = function () {
							CollectService.create({
								modelID: flyerID,
								category: 1
							}).then(function (data) {
								if (data.code === 200) {
									$scope.flyer.collectID = data.msg;
									$alert.success('收藏成功');
								} else {
									$alert.error(data.msg);
								}
							});
						};

						// 取消收藏
						$scope.uncollect = function () {
							CollectService.remove($scope.flyer.collectID)
								.then(function (data) {
									if (data.code === 200) {
										$scope.flyer.collectID = null;
										$alert.success(data.msg);
									} else {
										$alert.error(data.msg);
									}
								});
						};

						$scope.dismiss = function() {
							$modalInstance.dismiss();
						};
					}
				];
				return $modalService.show(option);
			}
		};
	}]);
});