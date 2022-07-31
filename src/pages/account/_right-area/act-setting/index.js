define([
	'app'
], function (app) {
	app.directive('actSetting', ['config', '$rootScope', '$http', '$alert', '$user', '$window', '$validator',
		function (config, $rootScope, $http, $alert, $user, $window, $validator) {
			var events = config.EVENTS;

			return {
				restrict: 'E',
				templateUrl: '/pages/account/right-area/act-setting/index.html',
				replace: true,
				link: function ($scope, $ele, $attrs) {

					$scope.pwdObj = {};
					$scope.actObj = {};
					// 重置密码
					$scope.resetPwd = function () {
						$scope.pwdEditing = true;
					};

					// 取消重置密码
					$scope.cancelPwd = function () {
						$scope.pwdObj = {};
						$scope.pwdEditing = false;
					};

					// 保存密码
					$scope.savePwd = function () {
						if ($scope.cpwd != $scope.npwd) {
							return $alert.error('新密码和确认密码不一致');
						}
						var method = 'put';
						if ($scope.user.nopwd) {
							method = 'post';
						}
						$http({
							method: method,
							url: '/api/user/pwd',
							data: $scope.pwdObj
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$alert.success(data.msg);
								$rootScope.user.nopwd = false;
								// 清空密码表单
								$scope.pwdObj = {};
								$scope.pwdEditing = false;
							} else {
								if (_.isObject(data.msg)) {
									$alert.error(data.msg.snippet);
								} else {
									$alert.error(data.msg);
								}
							}
						});
					};

					// 创建新账号
					$scope.initAct = function () {
						$scope.actIniting = true;
					};

					// 绑定
					$scope.bindAct = function () {
						$scope.actBinding = true;
					};

					// 取消创建、绑定账号
					$scope.cancelAct = function () {
						$scope.actObj = {};
						$scope.actIniting = false;
						$scope.actBinding = false;
					};

					//
					$scope.saveInitAct = function () {
						if ($scope.actObj.cpwd !== $scope.actObj.pwd) {
							return $alert.error('密码和确认密码不一致');
						}
						$http({
							method: 'put',
							url: '/api/user/initial',
							data: $scope.actObj
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$alert.success(data.msg);
								$rootScope.user.nopwd = false;
								$rootScope.user.email = $scope.actObj.email;
								$scope.actIniting = false;
							} else {
								if (_.isObject(data.msg)) {
									$alert.error(data.msg.snippet);
								} else {
									$alert.error(data.msg);
								}
							}
						});
					};

					$scope.saveBindAct = function () {
						$http({
							method: 'put',
							url: '/api/user/bind',
							data: $scope.actObj
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$alert.success(data.msg);
								$scope.actBinding = false;
								return window.location.replace('/account');
							} else {
								if (_.isObject(data.msg)) {
									$alert.error(data.msg.snippet);
								} else {
									$alert.error(data.msg);
								}
							}
						});
					};


					$scope.emailValid = function () {
						return $validator.validateEmail($scope.actObj.email, false);
					};


					//当用户未激活
					$scope.whenUserInitial = function () {
						return $scope.user.status === config.USERS.status.initial;
					};

					// 绑定社交
					$scope.bindSocial = function (type) {
						if (type === 'wechat') {
							$window.open('/oauth/wechat/pcLogin', '_self');
						} else {
							$window.open('/oauth/' + type + '/login', '_self');
						}
					};

					//取消绑定微博
					$scope.unbindSocial = function (type) {
						$http({
							method: 'put',
							url: '/api/social/' + type + '/unbind'
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$rootScope.user[type + 'Openid'] = null;
								$alert.success(data.msg);
							} else {
								return $alert.error(data.msg);
							}
						});
					};

					// 编辑昵称
					$scope.editNickname = function () {
						$scope.nicknameEditing = true;
					};

					// 保存昵称
					$scope.saveNickname = function ($valid) {
						if ($valid) {
							$http({
								method: 'put',
								url: '/api/user/nickname',
								data: {
									nickname: $scope.user.nickname
								}
							}).
							success(function (data, status, headers, config) {
								if (data.code === 200) {
									$alert.success('修改昵称成功');
									$scope.$emit(events.userProfileChange, {
										nickname: data.msg,
										action: 'updateNickname'
									});
									$scope.nicknameEditing = false;
								} else {
									$alert.error(data.msg);
								}
							});
						}
					};

					// 上传头像
					$scope.uploadAvatar = function (result) {
						var form = {
							head: result.cropUrl,
							headCrop: result.crop,
							headUrl: result.url
						};
						$http({
							method: 'put',
							url: '/api/user/head',
							data: form
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$user.setUserHead(form);
								$scope.$emit(events.userProfileChange, {
									action: 'updateHead',
									form: form
								});
								$alert.success('更新头像成功');
								$('.avatar-edit .blue').show();
							} else {
								$alert.error(data.msg);
							}
						});
					};

					// 编辑简介
					$scope.editDesc = function () {
						$scope.descEditing = true;
					};

					// 保存简介
					$scope.saveDesc = function ($valid) {
						if ($valid) {
							$http({
								method: 'put',
								url: '/api/user/desc',
								data: {
									desc: $scope.user.desc
								}
							}).
							success(function (data, status, headers, config) {
								if (data.code === 200) {
									$scope.user.desc = data.msg;
									$alert.success('修改简介成功');
									$scope.descEditing = false;
								} else {
									$alert.error(data.msg);
								}
							});
						}
					};
				}
			};
		}
	]);
});