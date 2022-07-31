define([
	'app'
], function(app) {
	app.directive('dtFormData', ['config', '$rootScope', '$http', '$state',
		function(config, $rootScope, $http, $state) {
			return {
				restrict: 'E',
				templateUrl: '/pages/data/form/form-data/index.html',
				scope: {
					page: '=ngModel',
					checkins: '=checkins'
				},
				link: function($scope, $ele, $attrs) {
					var flyerID = $state.params.flyerID,
						pageID = $scope.page.id;
					$http.jsonp(config.HOST.form + 'api/flyer/' + flyerID + '/page/' + pageID + '/view?callback=JSON_CALLBACK')
						.success(function(data) {
							$scope.checkins = data;
					});

				}
			};
		}
	]);
});