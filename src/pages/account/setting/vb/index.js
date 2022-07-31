define([
	'app',
	'pages/account/setting/config'
], function (app, pageConfig) {
	app.directive('actVb', ['$rootScope', function ($rootScope) {
		var template = '<div><select class="form-control input-sm"';
		template += 'ng-model="ngModel" ng-options="vb.key as vb.label for vb in VB">';
		template += '</select></div>';
		return {
			restrict: 'E',
			template: template,
			replace: true,
			scope: {
				ngModel: '=ngModel',
			},
			link: function($scope) {
				$scope.VB = pageConfig.vb;
				$scope.ngModel = $scope.ngModel || $scope.VB[0].key;
			}
		};
	}]);
});

