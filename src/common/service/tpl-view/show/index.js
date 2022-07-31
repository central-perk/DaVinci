define(['app'], function (app) {
	app.directive('tvShow', ['config', '$rootScope', 'hotkeys', function (config, $rootScope, hotkeys) {
		return {
			restrict: 'E',
			templateUrl: '/common/service/tpl-view/show/index.html',
			replace: true,
			scope: {
				tplId: '@',
				transferMode: '@'
			},
			link: function ($scope, $ele, $attrs) {
				$scope.tplID = $scope.tplId;

				// 监听
				$scope.$on('viewPreviewClick', function (event, data) {
					$scope.tplID = data.tplID;
				});

				var $iframe = $ele.find('iframe');
				$iframe[0].onload = function () {
					var iframeWindow = $iframe[0].contentWindow;

					$scope.prev = function () {
						iframeWindow.__DVC.slide.prev();
					};

					$scope.next = function () {
						iframeWindow.__DVC.slide.next();
					};
					console.log(1);
					$iframe.click();
				};

				// 上一页
				hotkeys.add({
					combo: 'up',
					callback: function () { $scope.prev();}
				});

				// 下一页
				hotkeys.add({
					combo: 'down',
					callback: function () {
					 $scope.next();
					}
				});

				// 上一页
				hotkeys.add({
					combo: 'left',
					callback: function () { $scope.prev();}
				});

				// 下一页
				hotkeys.add({
					combo: 'right',
					callback: function () { $scope.next();}
				});
			}
		};
	}]);
});