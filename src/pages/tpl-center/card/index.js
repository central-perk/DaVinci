define(['app'], function(app) {
	app.directive('tcCard', ['config', '$rootScope', '$alert', '$tplView', 'TplService', 'CollectService',
		function(config, $rootScope, $alert, $tplView, TplService, CollectService) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/tpl-center/card/index.html',
				replace: true,
				scope: {
					tpl: '=ngModel',
					onUncollect: '&'
				},
				link: function($scope, $ele, $attrs) {

					$scope.preview = function($event) {
						$tplView.show({tpl: $scope.tpl});
						$event.preventDefault();
						$event.stopPropagation();
						return false;
					};

					// $scope.collect = function ($event) {
					// 	CollectService.create({
					// 			modelID: $scope.tpl._id,
					// 			category: 0
					// 		})
					// 		.then(function (data) {
					// 			if (data.code === 200) {
					// 				$scope.tpl.collectID = data.msg;
					// 				$alert.success('收藏成功');
					// 			} else {
					// 				$alert.error(data.msg);
					// 			}
					// 		});
					// 	$event.preventDefault();
					// 	$event.stopPropagation();
					// 	return false;
					// };

                // $scope.uncollect = function($event) {
                // 	CollectService.remove($scope.tpl.collectID)
                // 		.then(function (data) {
                // 			if (data.code === 200) {
                // 				if ($scope.onUncollect) {
                // 					$scope.onUncollect({data: {
                // 						collectID: $scope.tpl.collectID
                // 					}});
                // 				}
                // 				$scope.tpl.collectID = null;
                // 				$alert.success(data.msg);
                // 			} else {
                // 				$alert.error(data.msg);
                // 			}
                // 		});
                // 	$event.preventDefault();
                // 	$event.stopPropagation();
                // 	return false;
                // };

				}
			};
		}
	]);
});