define(['app'], function (app) {
	app.service('$relation', ['$modalService', function ($modalService) {
		this.show = function (options, callback) {
			var defOptions = {
				title: '添加好友'
			};

			options = options || {};
			options = _.merge(defOptions, options);
			var onSave = options.onSave;


			$modalService.show({
				templateUrl: '/services/relation/index.html',
				width: 600,
				// height: 600,
				windowClass: 'relation-dialog rect-modal',
				controller: ['config', '$scope', '$rootScope', '$modalInstance', 'RelationService', '$alert',
					function (config, $scope, $rootScope, $modalInstance, RelationService, $alert) {
						$scope.title = options.title;
						$scope.query = {};
						$scope.relations = [];

						$scope.search = function (isLoadMore) {
							$('.relation-dialog .user-list').show();
							if (!isLoadMore && !$scope.query._title) return;

							if (!isLoadMore && $scope.query._title) {
								$scope.query.title = $scope.query._title;
								delete $scope.query._title;
								$scope.relations = [];
							}

							RelationService.search($scope.query)
								.then(function (data) {
									if (data.code === 200) {
										$scope.loading = false;
										$scope.relations = $scope.relations.concat(data.msg.relationships || []);
										$scope.next = data.msg.next;
										$scope.count = data.msg.count;
										$scope.nextPage = data.msg.nextPage;
									} else {
										$alert.error(data.msg);
									}
								});
						};

						$scope.create = function (relation) {
							relation.status = 10;
							RelationService.create({
									recieverID: relation.user._id
								})
								.then(function (data) {
									if (data.code === 200) {
										$alert.success('好友申请发送成功');
									} else {
										$alert.error(data.msg);
									}
								});
						};

						$scope.loadMore = function () {
							$scope.query.page = $scope.nextPage;
							$scope.search(true);
						};

						$scope.close = function () {
							$modalInstance.close();
						};

					}
				]
			});
		};
	}]);

	app.factory('RelationService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('relationships');
			return {
				list: function (query) {
					return baseTpl.customGET('', query);
				},
				// 已经是好友的列表
				listFriend: function (query) {
					return baseTpl.customGET('friends', query);
				},
				// 查找好友
				search: function (query) {
					return baseTpl.customGET('users', query);
				},
				create: function (relation) {
					return baseTpl.post(relation);
				},
				// 删除好友
				remove: function (relationID) {
					return baseTpl.one(relationID).customDELETE();
				},
				// 以用户 ID 创建
				createByUser: function (userID) {
					return baseTpl.customPOST({
								recieverID: userID
							});
				},
				allow: function (relationID, form) {
					return baseTpl.one(relationID)
						.one('allow')
						.customPUT(form);
				},
				updateGroup: function(relationID, group) {
					return Restangular.one('relationships', relationID)
						.one('group')
						.customPUT({
							group: group
						});
				},
			};
	}]);

});