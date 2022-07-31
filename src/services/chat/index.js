// 发私信
define(['app'], function (app) {
	app.service('$chat', ['$modalService', function ($modalService) {
		this.show = function (options, callback) {
			var defOptions = {
				title: '发私信给',
				confirmBtn: {
					label: '确认发送'
				}
			};

			options = options || {};
			options = _.merge(defOptions, options);
			options.title += options.user.nickname;
			var	onSave = options.onSave;


			$modalService.show({
				templateUrl: '/services/chat/index.html',
				width: 500,
				height: 300,
				windowClass: 'chat-dialog rect-modal',
				controller: ['config', '$scope', '$rootScope', '$modalInstance', 'UserService', '$alert',
					function (config, $scope, $rootScope, $modalInstance, UserService, $alert) {
						$scope.tags = config.TEMPLATES.tags;
						$scope.title = options.title;
						$scope.confirmBtn = options.confirmBtn;
						$scope.chat = {};

						$scope.contentLeft = function() {
							if (!$scope.chat || !$scope.chat.content) return 600;
							return 600 - $scope.chat.content.length;
						};

						// 单纯编辑封面
						$scope.save = function () {
							UserService.chat(options.user._id, $scope.chat)
								.then(function(data) {
									if (data.code === 200) {
										$alert.success(data.msg);
										if (onSave) onSave();
										$scope.close();
									} else {
										$alert.error(data.msg);
									}
								});
						};

						$scope.close = function () {
							$modalInstance.close();
						};

					}
				]
			});
		};
	}]);
});