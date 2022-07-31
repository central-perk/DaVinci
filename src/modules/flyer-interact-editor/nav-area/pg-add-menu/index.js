define([
	'app'
], function(app) {
	app.directive('fiPgAddMenu', ['config', '$rootScope', '$pgAddCustom', function(config, $rootScope, $pgAddCustom) {
		var events = config.EVENTS;
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/nav-area/pg-add-menu/index.html',
			replace: true,
			link: function($scope, $ele, $attrs) {
				var $pgAdd = $ele.parent('.nav-area').find('.pg-add');

				$pgAdd.on('mouseenter', showMenu);
				$pgAdd.on('mouseleave', clearShowMenu);


				$ele.on('mouseleave', hideMenu);

				$ele.find('.add-std').click(function(){
					if ($ele.width() === 410) {
						$ele.animate({width: 710}, 200, "linear");

					} else if ($ele.width() === 710) {
						$ele.animate({width: 410}, 200, "linear");
					}
				});


				$scope.toAddCustomPage = function($event) {
					$pgAddCustom.show(function(tpl) {
						$scope.$emit(events.pgAddBtnClick, {
							action: 'createCustom',
							tpl:tpl
						});
					});
				};

				$scope.addStdPg = function(tpl) {
					hideMenu();
					$scope.$emit(events.pgAddBtnClick, {
						action: 'createStd',
						tpl: tpl
					});
				};

				var showMenuTimer;

				// 100ms后显示菜单
				function showMenu() {
					if (showMenuTimer) {
						clearTimeout(showMenuTimer);
					}

					showMenuTimer = setTimeout(function() {
						$ele.css({
							top: $pgAdd.offset().top - $('body').scrollTop()
						});
						$ele.fadeIn('fast');
					},  100);
				}

				// 取消显示菜单
				function clearShowMenu() {
					clearTimeout(showMenuTimer);
				}

				// 隐藏菜单
				function hideMenu() {
					$ele.animate({width: 410}, 200, "linear");
					$ele.fadeOut('fast');
				}

			}
		};
	}]);
});