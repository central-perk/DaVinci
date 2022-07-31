define([
	'app'
], function (app) {
	app.directive('actFriend', ['config', '$rootScope', '$http', '$alert', 'RelationService', '$timeout',
		function (config, $rootScope, $http, $alert, RelationService, $timeout) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/account/right-area/act-friend/index.html',
				replace: true,
				link: function ($scope, $ele, $attrs) {

					var userID = $rootScope.user._id;

					$scope.listApply = function (page) {
						page = page || 1;
						if (page === 1) {
							$scope.applys = [];
						}
						RelationService.list({
							page: page
						}).then(function (data) {
							if (data.code === 200) {
								$scope.applys = data.msg.relationships;
								assembleApply($scope.applys);
								$scope.pagination = data.msg.pagination;
							} else {
								$alert.error(data.msg);
							}
						});

					};

					// // 添加好友
					// $scope.addFriend = function () {
					// 	if (!$scope.friendName) return;
					// 	RelationService.create({
					// 		title: $scope.friendName
					// 	}).then(function (data) {
					// 		if (data.code === 200) {
					// 			$scope.friendName = '';
					// 			$scope.applys = assembleApply([data.msg]).concat($scope.applys);
					// 		} else {
					// 			$alert.error(data.msg);
					// 		}
					// 	});
					// };


					// 接受好友申请
					$scope.accept = function (apply) {
						if (!apply._id) return;
						if (!confirm('确认添加好友？')) return;
						RelationService.allow(apply._id).then(function (data) {
							if (data.code === 200) {
								apply.status = 20;
							} else {
								$alert.error(data.msg);
							}
						});
					};

					// 删除好友
					$scope.rmFriend = function (apply) {
						if (!apply._id) return;

						if (!confirm('确认删除好友？')) return;
						RelationService.remove(apply._id).then(function (data) {
							if (data.code === 200) {
								_.remove($scope.applys, {
									_id: apply._id
								});
							} else {
								$alert.error(data.msg);
							}
						});
					};


					function assembleApply(applys) {
						_.forEach(applys, function (apply) {
							if (apply.master._id === userID) {
								apply.user = apply.reciever;
							} else {
								apply.user = apply.master;
							}
						});
						return applys;
					}

					$scope.listApply();


				}
			};
		}
	]);
});