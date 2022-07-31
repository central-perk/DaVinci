define([
	'app',
	'components/custome/text/content/index',
	'components/custome/image/content/index',
	'components/custome/ibox/content/index',
	'components/custome/map/content/index',
	'components/custome/video/content/index',
	'components/custome/slider/content/index',
	'components/custome/shape/content/index',
	'modules/flyer-interact-editor/edit-area/content/layer-link-select/index',
	'modules/flyer-interact-editor/edit-area/content/layer-submit-setting/index',
], function(app) {
	app.directive('fiEditContent', ['config', '$rootScope', function(config, $rootScope) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/content/index.html',
			scope: {
				layer: "=ngModel"
			},
			link: function($scope, $element, $attrs) {

			}
		};
	}]);
});
