define([
	'app',
	'pages/user/tpl/config',
	'pages/user/tpl/card-created/index',
	'pages/user/tpl/card-purchased/index',
], function (app, pageConfig) {
	app.controller('UserTplController', ['$scope', '$rootScope', '$state', 'config', '$alert', 'UserService', '$tplConfig', 'TplService',
		function ($scope, $rootScope, $state, config, $alert, UserService, $tplConfig, TplService) {
			var events = config.EVENTS,
				userID = $scope.user._id; // 访问目标用户的 userID


			if (!$rootScope.isAuthor($scope.user)) $state.go('user.flyer');

			$scope.init = function() {
				$scope.filters = pageConfig.filter.created;
				$scope.activeFilter = $scope.filters[0];
				$scope.loading = false;
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
				if (filter) {
					$scope.activeFilter = filter;
				} else {
					$scope.activeFilter = $scope.filters[0];
				}
				$scope.query = filter && filter.query || {};
				$scope.query.userID = $scope.user._id;
				$scope.tpls = [];
				$scope.listTpl();
			};

			// 创建模板
			$scope.createTpl = function() {
				$tplConfig.show({
					tpl: {
						logo: '/images/logo/xuan.png',
					},
					confirmBtn: {
						label: '创建'
					},
					action: 'create'
				});
			};

			// 删除模板
			$scope.$on(events.flyerCardClick, function ($event, data) {
				if (data && data.tpl && data.action === 'remove') {
					_.remove($scope.tpls, {_id: data.tpl._id});
				}
			});

			// 加载更多
			$scope.loadMore = function() {
				$scope.query.page = $scope.nextPage;
				$scope.listTpl();
			};

		}
	]);
});
