define([
	'app',
	'pages/plaza/card/index',
], function (app) {
	app.controller('PlazaController', ['$scope', 'config', '$alert', 'FlyerService',
		function ($scope, config, $alert, FlyerService) {
			var events = config.EVENTS;
			$scope.tags = config.TEMPLATES.tags;

			$scope.init = function() {
				$scope.query = {};
				$scope.hotFlyers = [];
				$scope.flyers = [];

				listHot();
				setTimeout(function () {
					var slideNum = $scope.hotFlyers.length < 5 ? $scope.hotFlyers.length : 5;
					$('.hot-flyers .card-list').slick({
						autoplay: true,
						speed: 500,
						slidesToShow: slideNum,
						slidesToScroll: slideNum
					});
					// $('.hot-flyers .card-list .slick-cloned .mdl-image-loading').remove();

				}, 500);

				$scope.listRecommend();
			};

			// 获取热门作品列表
			function listHot() {
				FlyerService.listHot()
					.then(function(data) {
						if (data.code == 200) {
							$scope.hotFlyers = data.msg;
						} else {
							console.log(data.msg);
						}
					});
			}

			// 获取推荐作品列表
			$scope.listRecommend = function() {
				if ($scope.nextPage) $scope.loading = true;
				FlyerService.listRecommend($scope.query)
					.then(function(data) {
						if (data.code == 200) {
							$scope.loading = false;

							$scope.searchTitle = $scope.query.title; // searchTitle?

							$scope.flyers = $scope.flyers.concat(data.msg.flyers || []);
							$scope.next = data.msg.next;
							$scope.count = data.msg.count;
							$scope.nextPage = data.msg.nextPage;
						} else {
							console.log(data.msg);
						}
					});
			};

			//搜索框按条件fixed
			$scope.searchInputFixed = function () {
				var $searchInput = $('.good-flyers .headline');
				$searchInput.scrollToFixed({
					limit: $('body').offset().top,
					zIndex: 100,
					preFixed: function () {
						$(this).css({
							'background-color': '#b8dbcb'
						});
					}
				});

				$scope.$on('$destroy', function () {
					//scope销毁场景,要对dom或bom元素的事件解绑
					$(window).off('scroll');
					$searchInput.unbind();
				});
			};

			$scope.loadMore = function () {
				$scope.query.page = $scope.nextPage;
				$scope.listRecommend();
			};

			$scope.searchByCond = function () {
				$scope.flyers = [];
				$scope.listRecommend();
				$scope.query.title = '';
			};
		}
	]);
});
