define([
	'app',
	'common/service/tpl-view/tpl/index',
	'common/service/tpl-view/author/index',
	'common/service/tpl-view/show/index',
	'common/service/flyer-view/reply/index', // 使用 flyer-view
], function(app) {
	app.factory('$tplView', [ '$modalService', function($modalService) {
		var defaultOptions = {
			width: 1100,
			height: 700,
			templateUrl: '/common/service/tpl-view/index.html',
			windowClass: 'modal-tpl-view modal-rect'
		};

		return {
			show: function(options) {
				var modelID = options.tpl._id,
					category = 0;
				options = _.merge(defaultOptions, options);
				options.resolve = {
					tpl: ['TplService', '$alert', function (TplService, $alert) {
						return TplService.getDetail(modelID)
							.then(function (data) {
								if (data.code === 200) {
									return data.msg;
								} else {
									$alert.error(data.msg);
								}
							});
					}]
				};
				options.controller = ['$scope', '$rootScope', '$modalInstance', '$alert', 'LikeService', 'CollectService', 'tpl',
					function($scope, $rootScope, $modalInstance, $alert, LikeService, CollectService, tpl) {
						$scope.tpl = tpl;
						$scope.tab = {};

						// 赞
						$scope.like = function () {
							LikeService.create({
								modelID: modelID,
								category: category
							}).then(function (data) {
								if (data.code === 200) {
									$scope.tpl.likeID = data.msg;
									$alert.success('点赞成功');
								} else {
									$alert.error(data.msg);
								}
							});
						};

						// 取消赞
						$scope.unlike = function () {
							LikeService.remove($scope.tpl.likeID)
								.then(function (data) {
									if (data.code === 200) {
										delete $scope.tpl.likeID;
										$alert.success(data.msg);
									} else {
										$alert.error(data.msg);
									}
								});
						};

						// 收藏
						$scope.collect = function () {
							CollectService.create({
								modelID: modelID,
								category: category
							}).then(function (data) {
								if (data.code === 200) {
									$scope.tpl.collectID = data.msg;
									$alert.success('收藏成功');
								} else {
									$alert.error(data.msg);
								}
							});
						};

						// 取消收藏
						$scope.uncollect = function () {
							CollectService.remove($scope.tpl.collectID)
								.then(function (data) {
									if (data.code === 200) {
										delete $scope.tpl.collectID;
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
				return $modalService.show(options);
			}
		};
	}]);
});