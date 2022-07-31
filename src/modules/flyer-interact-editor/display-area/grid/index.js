define([
	'app',
], function(app) {
	app.directive('fiGrid', ['config', '$rootScope',
		function(config, $rootScope) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/modules/flyer-interact-editor/display-area/grid/index.html',
				replace: true,
				link: function($scope, $ele, $attrs) {

					$scope.toggleGrid = function() {
						$ele.find('.trigger .sprite').toggle();
						if ($ele.find('.trigger .sprite.active').css('display') === 'none') {
							$ele.find('.grid-vertical, .grid-horizontal').hide();
						} else {
							$ele.find('.grid-vertical, .grid-horizontal').show();
						}
					};

					$scope.chooseColor = function($event) {
						var $parent = $($event.target).parent();
						var $color = $($event.target).parents('.dropdown-menu').find('.color');
						var gridColor = $parent.attr('class').split(' ').join('-');
						$scope.gridColor = gridColor;
						$ele.find('.grid-vertical, .grid-horizontal').show();

						// if ($parent.hasClass('active')) {
						// 	$ele.find('.grid-vertical, .grid-horizontal').hide();
						// 	$scope.gridColor = '';
						// } else {
						// 	$color.removeClass('active');
						// 	$ele.find('.grid-vertical, .grid-horizontal').show();
						// }
						// $parent.toggleClass('active');
					};
				}
			};
		}
	]);
});