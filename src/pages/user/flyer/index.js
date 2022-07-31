define([
	'app',
	'pages/user/flyer/config',
	'pages/user/flyer/card/index',
	'pages/user/flyer/card-friend/index',
], function (app, pageConfig) {
	app.controller('UserFlyerController', ['$scope', '$rootScope', '$state', '$http', 'config', '$alert', '$utils', 'UserService', '$flyerConfig', 'FlyerService',
		function ($scope, $rootScope, $state, $http, config, $alert, $utils, UserService, $flyerConfig, FlyerService) {
			var events = config.EVENTS,
				userID = $scope.user._id; // 访问目标用户的 userID


			$scope.init = function() {
				$scope.filters = pageConfig.filter.flyer;
				$scope.activeFilter = $scope.filters[0];
				$scope.loading = false;
			};

			$scope.listFlyer = function () {
				if ($scope.nextPage) $scope.loading = true;
				$scope.query.userID = userID;
				return FlyerService.list($scope.query)
					.then(function(data) {
						if (data.code === 200) {
							$scope.loading = false;
							$scope.flyers = $scope.flyers.concat(data.msg.flyers || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			$scope.listFriendFlyer = function () {
				if ($scope.nextPage) $scope.loading = true;
				$http({
					method: 'get',
					url: '/api/relationships/flyers',
					params: $scope.query
				})
				.success(function (data, status, headers, config) {
					if (data.code === 200) {
						$scope.loading = false;
						$scope.friendFlyers = $scope.friendFlyers.concat(data.msg.flyers || []);

						$scope.next = data.msg.next;
						$scope.count = data.msg.count;
						$scope.nextPage = data.msg.nextPage;
					} else {
						$alert.error(data.msg);
					}
				});
			};

			$scope.listFlyerByQuery = function(filter) {
				delete $scope.next;
				delete $scope.count;
				delete $scope.nextPage;
				if (filter) $scope.activeFilter = filter;
				$scope.query = filter && filter.query || {};
				$scope.query.userID = $scope.user._id;
				$scope.flyers = [];
				$scope.listFlyer();
			};

			$scope.listFriendFlyerByQuery = function(filter) {
				delete $scope.next;
				delete $scope.count;
				delete $scope.nextPage;
				$scope.activeFilter = $scope.filters[0];
				$scope.query = filter && filter.query || {};
				$scope.friendFlyers = [];
				$scope.listFriendFlyer();
			};

			// 创建作品
			$scope.createFlyer = function () {
				$flyerConfig.show({
					flyer: {
						logo: '/images/logo/xuan.png',
						logoCrop: {},
						desc: ''
					},
					title: '新建作品',
					confirmBtn: {
						label: '确定'
					},
					hidePermissionEdit: true,
					action: 'create'
				});
			};

			// 删除作品
			$scope.$on(events.flyerCardClick, function ($event, data) {
				if (data && data.flyer && data.action === 'remove') {
					_.remove($scope.flyers, {_id: data.flyer._id});
				}
			});

			// 加载更多
			$scope.loadMore = function(opt) {
				$scope.query.page = $scope.nextPage;
				$scope[opt]();
			};

		}
	]);
});
