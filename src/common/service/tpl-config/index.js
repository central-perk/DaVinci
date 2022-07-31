define(['app'], function (app) {
	app.service('$tplConfig', ['$modalService', function ($modalService) {
		this.show = function(option) {
			var defaultOption = {
				title: '模板设置',
				width: 700,
				height: 460,
				templateUrl: '/common/service/tpl-config/index.html',
				windowClass: 'tpl-config rect-modal',
				confirmBtn: {
					label: '保存'
				}
			};
			option = _.merge(defaultOption, option);
			option.controller = ['config', '$scope', '$rootScope', '$modalInstance', '$alert', '$imageManage', 'TplService',
				function(config, $scope, $rootScope, $modalInstance, $alert, $imageManage, TplService) {
					$scope.tags = config.TEMPLATES.tags;
					$scope.transfers = [{
						label: '横向',
						key: 'horizontal'
					}, {
						label: '纵向',
						key: 'vertical'
					}];
					$scope.title = option.title;
					$scope.confirmBtn = option.confirmBtn;
					$scope.tpl = option.tpl || {};
					$scope.tpl.transferMode = $scope.tpl.transferMode || $scope.transfers[0].key;
					if ($scope.tpl.price) {
						var priceStr = $scope.tpl.price.toString();
						if (priceStr.length === 1) {
							priceStr = '00' + priceStr;
						}
						if (priceStr.length === 2) {
							priceStr = '0' + priceStr;
						}
						$scope.priceIndex = [Number(priceStr[2] || 0), Number(priceStr[1] || 0), Number(priceStr[0] || 0)];
					} else if (!$scope.tpl.isFree) {
						$scope.priceIndex = [9, 9, 0];
					} else {
						$scope.priceIndex = [0, 0, 0];
					}

					if ($scope.tpl.buyoutSupport == null) {
						$scope.tpl.buyoutSupport = true;
					}
					if ($scope.tpl.integralSupport == null) {
						$scope.tpl.integralSupport = true;
					}
					if ($scope.tpl.afterSaleSupport == null) {
						$scope.tpl.afterSaleSupport = true;
					}

					// 替换封面
					$scope.replaceLogo = function () {
						$imageManage.init(null, {
								title: '替换封面',
								ratio: 1,
								disableDynamic: true,
								disableMulti: true
							})
							.then(function (imagePacks) {
								$scope.tpl.logoCustomValue = imagePacks[0].cropUrl;
								$scope.tpl.logo = imagePacks[0].cropUrl;
							});
					};

					// 选择默认封面
					$scope.selectLogo = function () {
						delete $scope.tpl.logoCustomValue;
					};

					$scope.$watch('priceIndex', function (newValue, oldValue) {
						newValue[0] = Number(newValue[0] || 0);
						newValue[1] = Number(newValue[1] || 0);
						newValue[2] = Number(newValue[2] || 0);
						if (newValue[0] || newValue[1] || newValue[2]) {
							$scope.tpl.isFree = false;
						} else {
							$scope.tpl.isFree = true;
						}
						$scope.tpl.price = newValue[2] * 100 + newValue[1] * 10 + newValue[0];
					}, true);

					// 将模板设置成免费
					$scope.setFree = function () {
						$scope.priceIndex = [0, 0, 0];
					};

					// 单纯编辑封面
					$scope.save = function () {
						if (option.action === 'update') {
							TplService.updateSetting($scope.tpl._id, $scope.tpl)
								.then(function (data) {
									if (data.code === 200) {
										$alert.success('保存成功');
										$modalInstance.close($scope.tpl);
									} else {
										$alert.error(data.msg);
									}
								});
						} else if (option.action === 'create') {
							TplService.create($scope.tpl)
								.then(function (data) {
									if (data.code === 200) {
										window.location.pathname = '/templates/' + data.msg + '/edit';
									} else {
										$alert.error(data.msg);
									}
								});
						} else {
							alert('action not found');
						}
					};


					$scope.close = function() {
						$modalInstance.dismiss();
					};
				}
			];
			return $modalService.show(option);
		};
	}]);
});