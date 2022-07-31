define([
	'app',
	'modules/flyer-interact-editor/display-area/grid/index',

], function(app) {
	app.directive('fiDisplayArea', ['config', '$rootScope', '$layerClipboard', '$layerFactory', '$layerManage',
		function(config, $rootScope, $layerClipboard, $layerFactory, $layerManage) {
			var events = config.EVENTS,
				fiCptBasePath = '/components/interact/',
				fiPageCustomeBasePath = '/components/custome/';
			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/display-area/index.html',
				replace: true,
				link: function($scope, $ele, $attrs) {
					$ele.on('click', function($event) {
						if ($($event.target).hasClass('display-area')) {
							$scope.$apply(function() {
								$rootScope.$broadcast(events.pageBgClick, {
									action: 'chooseBg'
								});
								$layerManage.setCurLayer(null);
							});
						}
					});
				}
			};
		}
	]);
});