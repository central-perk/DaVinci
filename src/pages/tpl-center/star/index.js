define(['app'], function(app) {
	app.directive('tcStar', ['$rootScope', '$timeout',
		function($rootScope, $timeout) {
			return {
				restrict: 'E',
				templateUrl: '/pages/tpl-center/star/index.html',
				replace: true,
				scope: {
					tpl: '=ngModel'
				},
				link: function($scope, $ele, $attrs) {
					var timer;
					$scope.dropdown = {
						isopen: false
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
				}
			};
		}
	]);
});