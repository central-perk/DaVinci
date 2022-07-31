define([
	'app',
	'pages/account/relation/config',
], function (app, pageConfig) {
	app.controller('ActRelationController', ['config', '$scope', '$rootScope', '$http', '$alert', '$timeout', 'RelationService',
		function (config, $scope, $rootScope, $http, $alert, $timeout, RelationService) {
			var events = config.EVENTS;
			var userID = $rootScope.user._id;
			$scope.GROUP = pageConfig.group;

			$scope.listApply = function (page) {
				page = page || 1;
				if (page === 1) {
					$scope.relations = [];
				}
				RelationService.list({
					page: page
				}).then(function (data) {
					if (data.code === 200) {
						$scope.relations = data.msg.relationships;
						$scope.pagination = data.msg.pagination;
					} else {
						$alert.error(data.msg);
					}
				});

			};

			$scope.updateGroup = function(relation) {
				RelationService.updateGroup(relation._id, relation.group)
					.then(function(data) {
						if (data.code === 200) {
							$alert.success(data.msg);
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// 接受好友申请
			$scope.accept = function (relation) {
				if (!relation._id) return;
				if (!confirm('确认添加好友？')) return;
				RelationService.allow(relation._id).then(function (data) {
					if (data.code === 200) {
						relation.status = 20;
						$alert.success(data.msg);
					} else {
						$alert.error(data.msg);
					}
				});
			};

			// 删除好友
			$scope.rmFriend = function (relation) {
				if (!relation._id) return;
				if (!confirm('确认删除好友？')) return;
				RelationService.remove(relation._id).then(function (data) {
					if (data.code === 200) {
						_.remove($scope.relations, {
							_id: relation._id
						});
					} else {
						$alert.error(data.msg);
					}
				});
			};


			$scope.listApply();
		}
	]);
});