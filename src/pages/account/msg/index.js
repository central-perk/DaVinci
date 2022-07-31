define([
	'app'
], function(app) {
	app.controller('ActMsgController', ['config', '$scope', '$rootScope', '$http', '$alert', '$timeout', '$chat','$tplView','$flyerView',
		function(config, $scope, $rootScope, $http, $alert, $timeout, $chat,$tplView,$flyerView) {
			var events = config.EVENTS,
				STATUS_MESSAGES = config.MESSAGES.status;

			// 获取消息记录列表
			$scope.listMsgs = function(page) {
				page = page || 1;
				$http({
					method: 'get',
					url: '/api/messages',
					params: {page: page}
				}).
				success(function(data, status, headers, config) {
					if (data.code === 200) {
						$scope.msgs = data.msg.messages;
						$scope.pagination = data.msg.pagination;
						$timeout(function() {
							$(window).resize();
						});
					} else {
						$alert.error(data.msg);
					}
				});
			};

			// 阅读单条信息
			$scope.readMsg = function(message) {
				if (message.status === STATUS_MESSAGES.unread) {
					$http({
						method: 'put',
						url: '/api/messages/' + message._id + '/read'
					}).
					success(function(data, status, headers, config) {
						if (data.code === 200) {
							$scope.unReadMsgCount -= 1;
							message.status = STATUS_MESSAGES.read;
							$scope.$emit(events.countUnReadMessages);
						} else {
							$alert.error(data.msg);
						}
					});
				}
			};

			// 阅读所有信息
			$scope.readAll = function() {
				$http({
					method: 'put',
					url: '/api/messages/readall'
				}).
				success(function(data, status, headers, config) {
					if (data.code === 200) {
						$scope.unReadMsgCount = 0;
						_.forEach($scope.msgs, function(msg) {
							msg.status = STATUS_MESSAGES.read;
						});
						$scope.$emit(events.countUnReadMessages);
						$alert.success(data.msg);
					} else {
						$alert.error(data.msg);
					}
				});
			};

			$scope.reply = function(user) {
				$chat.show({
					user: user
				});
			};
			$scope.viewTpl = function(tplID){
				$tplView.show({
					tpl:{
						_id: tplID
					}
				});
			};
			
			$scope.viewFlyer = function(flyerID){
				$flyerView.show({
					flyer:{
						_id:flyerID
					}
				});
			};

			$scope.listMsgs();


		}
	]);
});