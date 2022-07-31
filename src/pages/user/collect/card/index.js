define(['app'], function(app) {
	app.directive('userCollectCard', ['config', '$rootScope', '$alert', '$flyerView', '$tplView', 'CollectService',
		function(config, $rootScope, $alert, $flyerView, $tplView, CollectService) {
			return {
				restrict: 'E',
				templateUrl: '/pages/user/collect/card/index.html',
				replace: true,
				scope: {
					ngModel: '=',
					opt: '@',
					onUncollect: '&'
				},
				link: function($scope, $ele, $attrs) {

					$attrs.$observe('opt', function() {
						$scope.opt = $scope.$parent.$eval($attrs.opt);
					});

					$scope.preview = function($event) {
						if ($scope.opt.category === 0) {
							$tplView.show({tpl: $scope.ngModel});
						} else if ($scope.opt.category === 1) {
							$flyerView.show({flyer: $scope.ngModel});
						}
						$event.preventDefault();
						$event.stopPropagation();
						return false;
					};

					$scope.collect = function ($event) {
						CollectService.create($scope.opt)
							.then(function (data) {
								if (data.code === 200) {
									$scope.ngModel.collectID = data.msg;
									$alert.success('收藏成功');
								} else {
									$alert.error(data.msg);
								}
							});
						$event.preventDefault();
						$event.stopPropagation();
						return false;
					};

					$scope.uncollect = function($event) {
						CollectService.remove($scope.ngModel.collectID)
							.then(function (data) {
								if (data.code === 200) {
									if ($scope.onUncollect) {
										$scope.onUncollect({
											data: {
												collectID: $scope.ngModel.collectID
											}
										});
									}
									$scope.ngModel.collectID = null;
									$alert.success(data.msg);
								} else {
									$alert.error(data.msg);
								}
							});
						$event.preventDefault();
						$event.stopPropagation();
						return false;
					};

				}
			};
		}
	]);
});