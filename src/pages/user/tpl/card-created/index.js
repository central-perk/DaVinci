define(['app'], function (app) {
	app.directive('userTplCardCreated', ['$rootScope', 'config', '$timeout', '$confirm', '$alert', '$tplConfig', 'TplService', '$utils', '$q', '$affirm', '$tplView',
		function ($rootScope, config, $timeout, $confirm, $alert, $tplConfig, TplService, $utils, $q, $affirm, $tplView) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/user/tpl/card-created/index.html',
				replace: true,
				require: 'ngModel',
				scope: {
					tpl: '=ngModel'
				},
				link: function ($scope, $element, $attrs) {
					var timer;
					$scope.dropdown = {
						isopen: false
					};
					var tplID = $scope.tpl._id;

					// 编辑
					$scope.edit = function ($event) {
						window.location.pathname = '/templates/' + tplID + '/edit';
					};

					// 预览
					$scope.preview = function() {
						$tplView.show({tpl: $scope.tpl});
					};


					$scope.clickTop = function() {
						if ($scope.tpl.status === 20) return;
						if ($scope.tpl.status === 30) {
							$scope.preview();
						} else {
							$scope.edit();
						}
					};

					// 设置作品
					$scope.config = function ($event) {
						TplService.getSetting(tplID)
							.then(function (data) {
								if (data.code !== 200) return $alert.error(data.msg);
								$tplConfig.show({
									tpl: data.msg,
									title: '模板设置',
									action: 'update'
								}).then(function(tpl) {
									$scope.tpl = _.merge($scope.tpl, tpl);
								});
							});
					};

					// 准备删除作品
					$scope.toRm = function ($event, flyer) {
						$affirm.show({
							msg: '确认删除模板？',
							btnConfirm: {
								label: '删除'
							}
						}).then(function() {
							TplService.remove(tplID).then(function (data) {
								if (data.code === 200) {
									$alert.success('删除成功');
									$scope.$emit(events.flyerCardClick, {
										tpl: $scope.tpl,
										action: 'remove'
									});
								} else {
									$alert.error(data.msg);
								}
							});
						});
					};

					$scope.closeDropdown = function () {
						timer = $timeout(function () {
							$scope.dropdown.isopen = false;
						}, 300);
					};

					$scope.openDropdown = function () {
						$timeout.cancel(timer);
						$scope.dropdown.isopen = true;
					};

					$scope.deltaTime = function (ts) {
						var now = moment(),
							update = moment(ts);
						return update.from(now);
					};
				}
			};
		}
	]);
});