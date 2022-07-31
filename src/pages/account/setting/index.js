define([
	'app',
	'pages/account/setting/config',
	'pages/account/setting/vb/index',
], function (app, pageConfig) {
	app.controller('ActSettingController', ['config', '$scope', '$rootScope', '$http', '$alert', '$user', '$validator', 'UserService',
		function (config, $scope, $rootScope, $http, $alert, $user, $validator, UserService) {
			var events = config.EVENTS,
				userID = $rootScope.user._id;

			$scope.init = function() {
				$scope.EDU = pageConfig.edu;
				$scope.PROVINCE = pageConfig.province;
				$scope.GENDER = pageConfig.gender;


				$scope.pwdObj = {};
				$scope.actObj = {};

				$scope.getInfo();
			};


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

			// 获取手机验证码
			$scope.getCode = function() {
				$scope.showSubmitCode = true;
				UserService.getVcode(userID, $scope.user._truetel)
					.then(function(data) {
						if (data.code === 200) {
							$alert.success(data.msg);

							$scope.count = 60;
							$scope.showCount = true;
							setInterval(function() {
								$scope.$apply(function() {
									$scope.count -= 1;
									if ($scope.count === 0) {
										$scope.showCount = false;
									}
								});
							}, 1000);
						} else {
							$alert.error(data.msg);
						}
					});
			};

			// 提交验证码
			$scope.submitCode = function() {
				UserService.submitVcode(userID, {
					truetel: $scope.user._truetel,
					code : $scope.user._code
				}).then(function(data) {
					if (data.code === 200) {
						$scope.user.truetel = $scope.user._truetel;
						$alert.success(data.msg);
					} else {
						$alert.error(data.msg);
					}
				});
			};

			$scope.telValid = function() {
				return $validator.validateTel($scope.user._truetel);
			};

			// 绑定社交
			$scope.bindSocial = function (type) {
				if (type === 'wechat') {
					window.open('/oauth/wechat/pcLogin', '_self');
				} else {
					window.open('/oauth/' + type + '/login', '_self');
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

			$scope.getInfo = function() {
				UserService.getInfo(userID)
					.then(function(data) {
						if (data.code === 200) {
							$scope.user = _.merge($scope.user, data.msg);
						} else {
							$alert.error(data.msg);
						}
					});
			};


			$scope.editInfo = function() {
				$scope.infoEditing = true;
				$scope.user.education = $scope.user.education || $scope.EDU[0].key;
				$scope.user.gender = $scope.user.gender || 0;
				$scope.user.homeProvince = $scope.user.homeProvince || $scope.PROVINCE[0].key;
				$scope.user.homeCity = $scope.user.homeCity || $scope.PROVINCE[0].city[0].key;
				$scope.user.nowProvince = $scope.user.nowProvince || $scope.PROVINCE[0].key;
				$scope.user.nowCity = $scope.user.nowCity || $scope.PROVINCE[0].city[0].key;
			};

			$scope.saveInfo = function($valid) {
				if (!$valid) return;
				UserService.updateInfo(userID, $scope.user)
					.then(function(data) {
						if (data.code === 200) {
							$alert.success(data.msg);
							$scope.infoEditing = false;
						} else {
							$alert.error(data.msg);
						}
					});
			};

			$scope.changeProvince = function(place) {
				if ($scope.user[place + 'Province'] == null) return;
				$scope.user[place + 'City'] = $scope.PROVINCE[$scope.user[place + 'Province']].city[0].key;
			};

			$scope.isEmpty = function(data) {
				return _.isUndefined(data) || _.isNull(data) || data === '';
			};

			// // 编辑简介
			// $scope.editDesc = function () {
			// 	$scope.descEditing = true;
			// };

			// // 保存简介
			// $scope.saveDesc = function ($valid) {
			// 	if ($valid) {
			// 		$http({
			// 			method: 'put',
			// 			url: '/api/user/desc',
			// 			data: {
			// 				desc: $scope.user.desc
			// 			}
			// 		}).
			// 		success(function (data, status, headers, config) {
			// 			if (data.code === 200) {
			// 				$scope.user.desc = data.msg;
			// 				$alert.success('修改简介成功');
			// 				$scope.descEditing = false;
			// 			} else {
			// 				$alert.error(data.msg);
			// 			}
			// 		});
			// 	}
			// };

		}
	]);
});