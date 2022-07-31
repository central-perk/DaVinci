// 图片加载中 loading gif
define(['app'], function(app) {
	app.directive('imageLoading', ['$rootScope', '$utils', function factory($rootScope, $utils) {
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {

				// 节点可能被克隆，隐藏打上标记
				var uniqClass = 'image-loading-' + $utils.createToken();
				$element.addClass(uniqClass);
				$ele = $('.' + uniqClass);
				$ele.on('load', function() {
					$(this).parent().find('.mdl-image-loading').remove();
					$(this).css('visibility', 'visible');
				});


				$scope.$watch('ngSrc', function() {
					$element.css('visibility', 'hidden');
					$element.parent().prepend('<img src="/images/image-loading.gif" class="mdl-image-loading">');
				});
			}
		};
	}]);
});
