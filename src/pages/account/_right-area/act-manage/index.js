define([
	'app'
], function (app) {
	app.directive('actManage', ['config', '$rootScope', '$http', '$alert', '$location', '$timeout',
		function (config, $rootScope, $http, $alert, $location, $timeout) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/account/right-area/act-manage/index.html',
				replace: true,
				link: function ($scope, $ele, $attrs) {


					// 获取交易信息列表
					$scope.listBills = function (page) {
						page = page || 1;
						$http({
							method: 'get',
							url: '/api/bills',
							params: {
								page: page
							}
						}).
						success(function (data, status, headers, config) {
							if (data.code === 200) {
								$scope.bills = data.msg.bills;

								$scope.pagination = data.msg.pagination;
								$timeout(function () {
									$(window).resize();
								});
							} else {
								$alert.error(data.msg);
							}
						});
					};

					$scope.listBills();


					$scope.getEdou = function ($event) {
						activeTab($event);

						$scope.activeLayout = 'get-edou';
					};
					$scope.exchangeRmlogo = function ($event) {
						activeTab($event);
						$scope.costs = $scope.getCosts({
							name: 'rmLogo',
							unit: 'integral'
						});
						$scope.cost = $scope.costs[0];
						$scope.cost.active = true;
						$scope.activeLayout = 'exchange-rmlogo';
					};


					$scope.buyRmlogo = function ($event) {
						activeTab($event);
						$scope.costs = $scope.getCosts({
							name: 'rmLogo',
							unit: 'money'
						});
						// $scope.cost = $scope.costs[0];
						// $scope.cost.active = true;
						$scope.chooseCost($scope.costs[0]);
						$scope.activeLayout = 'buy-rmlogo';
					};


					$scope.getCosts = function (options) {
						$scope.pack = options;
						return _.cloneDeep(config.SERVICE_PACK[options.name][options.unit].costs);
					};


					function activeTab($event) {
						$('.property-list li').removeClass('active');
						$($event.target).parents('li').addClass('active');
					}

					$scope.chooseCost = function (cost) {
						if ($scope.cost) {
							$scope.cost.active = false;
						}
						$scope.cost = cost;
						$scope.cost.active = true;

						$scope.wechatPaySetting = {
							price: $scope.cost.price,
							subject: $scope.cost.name,
							unit: $scope.pack.unit,
							pack: $scope.pack.name,
							category: $scope.cost.category
						};
					};

				}
			};
		}
	]);
});