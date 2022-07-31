define([
	'app',
	'pages/data/stat/config',
], function (app, pageConfig) {
	app.directive('dtStatEvent', ['config', '$rootScope', '$http', 'ngTableParams', '$utils', '$timeout',
		function (config, $rootScope, $http, ngTableParams, $utils, $timeout) {
			return {
				restrict: 'E',
				templateUrl: '/pages/data/stat/event/index.html',
				scope: {
					aId: '@'
				},
				link: function ($scope, $ele, $attrs) {
					$scope.queryBtns = pageConfig.queryBtns;
				},
				controller: ['$scope', function ($scope) {
					var aID = $scope.aId,
						chartDataWait = '<span class="help-block">数据加载中</span>',
						chartDataError = '<span class="help-block">暂无数据</span>';

					$scope.pagination = {
						curPage: 1,
						perPage: 10
					};
					$scope.contentType = false;

					$scope.init = function() {
						$scope.queryByDate('week');
					};

					$scope.queryByDate = function(st, et) {
						$scope.queryDate = st;
						switch (st) {
							case 'today':
								et = (new Date()).getTime();
								st = et;
								$scope.curDate = (new Date()).getMonth() + 1 + '-' + (new Date()).getDate();
								break;
							case 'yesterday':
								et = (new Date()).getTime() - 24 * 60 * 60 * 1000;
								st = et;
								$scope.curDate = (new Date()).getMonth() + 1 + '-' + ((new Date()).getDate() - 1);
								break;
							case 'week':
								et = (new Date()).getTime();
								st = et - 7 * 24 * 60 * 60 * 1000;
								break;
							case 'month':
								et = (new Date()).getTime();
								st = et - 29 * 24 * 60 * 60 * 1000;
								break;
							default:
								st = Number(st);
								et = Number(et);
								if (st === et) {
									$scope.curDate = (new Date(st)).getMonth() + 1 + '-' + (new Date(st)).getDate();
								}
						}
						if (st === et) {
							$scope.singleDay = true;
						} else {
							$scope.singleDay = false;
						}
						if (st > et) {
							$scope.datePickerErr = true;
						} else {
							$scope.datePickerErr = false;
							$scope.chartInit(st, et);
						}
					};

					$scope.chartInit = function (st, et) {
						$('.event .section-error').html(chartDataWait).show();
						$http({
							method: 'get',
							url: '/api/analytics/event',
							params: {
								siteID: aID,
								st: st || (new Date()).getTime(),
								et: et || (new Date()).getTime(),
								category: 'flyer',
								action: 'wxShare'
							}
						})
						.success(function (data) {
							if (data.code === 200 && data.msg.sum) {
								data = data.msg;

								$scope.seriesData = data.seriesData;
								$scope.categories = data.categories;
								$scope.categoriesReverse = _.clone(data.categories.reverse());
								$scope.seriesDataReverse = _.cloneDeep(data.seriesData.data.reverse());
								data.categories.reverse();
								data.seriesData.data.reverse();
								$scope.shareSum = data.sum;
								$scope.doPage(1);

								$scope.pagination.pageNum = Math.ceil($scope.categories.length / $scope.pagination.perPage);
								$scope.pagination.pages = [];
								for (var i = 1; i <= $scope.pagination.pageNum; i++) {
									$scope.pagination.pages.push(i);
								}
								$utils.setLineChart($scope, 'event', [$scope.seriesData], $scope.categories);
								$('.event .section-error').hide();
								$('.event .section-body').show();
								$('.event .section-header .fa').show();
							} else {
								$('.event .section-body').hide();
								$('.event .section-error').html(chartDataError).show();
							}
							$scope.resizePage();
						})
						.error(function () {
							$('.event .section-error').html(chartDataError).show();
						});
					};

					$scope.doPage = function (page) {
						$scope.pagination.curPage = page;
						var sIndex = ($scope.pagination.curPage - 1) * $scope.pagination.perPage,
							eIndex = sIndex + $scope.pagination.perPage;
						$scope.tableCategories = $scope.categoriesReverse.slice(sIndex, eIndex);
					};

					$scope.resizePage = function () {
						$timeout(function () {
							$(window).resize();
						});
					};

				}]
			};
		}
	]);
});