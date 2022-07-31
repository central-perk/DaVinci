define([
	'app',
	'components/custome/text/style/index',
	'components/custome/image/style/index',
	'components/custome/ibox/style/index',
	'components/custome/map/style/index',
	'components/custome/video/style/index',
	'components/custome/slider/style/index',
	'components/custome/shape/style/index'
], function(app) {
	app.directive('fiEditStyle', ['config', '$rootScope', function(config, $rootScope) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/style/index.html',
			scope: {
				layer: "=ngModel"
			},
			link: function($scope, $element, $attrs) {

			}
		};
	}]);
});
