define([
	'app',
	'pages/data/stat/config',
	'pages/data/stat/event/index',
], function (app, pageConfig) {
	app.directive('dtStat', ['config', '$rootScope', '$routeParams', '$alert', '$http', '$flyer', '$utils', '$timeout', 'ngTableParams', '$filter',
		function (config, $rootScope, $routeParams, $alert, $http, $flyer, $utils, $timeout, ngTableParams, $filter) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/data/stat/index.html',
				link: function ($scope, $ele, $attrs) {
					$scope.queryBtns = pageConfig.queryBtns;
					$scope.refMap = pageConfig.refMap;
				},
				controller: ['$scope', function ($scope) {
					var flyerID = $scope.flyer._id,
						aID = $scope.flyer.aID,
						chartDataWait = '<span class="help-block">数据加载中</span>',
						chartDataError = '<span class="help-block">暂无数据</span>';
						// chartDataError = '<span class="help-block">数据功能升级，稍后开放</span>';

					$scope.trafficTime = {};
					$scope.refTime = {};
					$scope.contentType = false;
					$scope.pagination = {
						curPage: 1,
						perPage: 10
					};
					$scope.resizePage = function () {
						$timeout(function () {
							$(window).resize();
						});
					};

					$scope.overviewInit = function () {
						$http.get('/' + $utils.url.join('api', 'analytics', 'site', aID, 'overview') + '?callback=JSON_CALLBACK')
							.success(function (data) {
								if (data.code === 200) {
									$scope.pv = data.msg.pv;
									$scope.wxShare = data.msg.wxShare;
									$scope.ref = data.msg.ref;
									$scope.resizePage();
								}
							});
					};
					$scope.trafficQuery = function (st, et) {
						$scope.trafficQueryDate = st;
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
							$scope.trafficDtpickerErr = true;
						} else {
							$scope.trafficDtpickerErr = false;
							$scope.trafficChartInit(st, et);
						}
					};
					$scope.trafficChartInit = function (st, et) {
						var query = $utils.makeQuery({
							siteID: aID,
							st: st || (new Date()).getTime(),
							et: et || (new Date()).getTime()
						});
						// $('.traffic .section-error').html(chartDataError).show();
						$('.traffic .section-error').html(chartDataWait).show();
						$http.get('/' + $utils.url.join('api', 'analytics', 'visit', 'traffic?') + query)
							.success(function (data) {
								if (data.code === 200 && data.msg.sum) {
									data = data.msg;

									$scope.trafficSeriesData = data.seriesData;
									$scope.trafficCategories = data.categories;
									$scope.trafficCategoriesReverse = _.clone(data.categories.reverse());
									$scope.trafficSeriesDataReverse = _.cloneDeep(data.seriesData);
									$scope.trafficSeriesDataReverse[0].data = _.clone(data.seriesData[0].data.reverse());
									$scope.trafficSeriesDataReverse[1].data = _.clone(data.seriesData[1].data.reverse());
									data.categories.reverse();
									data.seriesData[0].data.reverse();
									data.seriesData[1].data.reverse();
									$scope.pvSum = data.sum.pv;
									$scope.uvSum = data.sum.uv;
									$scope.doPage(1);

									$scope.pagination.pageNum = Math.ceil($scope.trafficCategories.length / $scope.pagination.perPage);
									$scope.pagination.pages = [];
									for (var i = 1; i <= $scope.pagination.pageNum; i++) {
										$scope.pagination.pages.push(i);
									}
									$utils.setLineChart($scope, 'traffic', $scope.trafficSeriesData, $scope.trafficCategories);
									$('.traffic .section-error').hide();
									$('.traffic .section-body').show();
									$('.traffic .section-header .fa').show();
								} else {
									$('.traffic .section-error').html(chartDataError).show();
								}
								$scope.resizePage();
							})
							.error(function () {
								$('.traffic .section-error').html(chartDataError).show();
							});
					};
					$scope.refQuery = function (st, et) {
						$scope.refQueryDate = st;
						var dateObj = query(st, et);
						st = dateObj.st;
						et = dateObj.et;
						if (st > et) {
							$scope.refDtpickerErr = true;
						} else {
							$scope.refDtpickerErr = false;
							$scope.refChartInit(st, et);
						}
					};
					$scope.refChartInit = function (st, et) {
						var query = $utils.makeQuery({
							siteID: aID,
							st: st || (new Date()).getTime(),
							et: et || (new Date()).getTime()
						});
						// $('.ref .section-error').html(chartDataError).show();
						$('.ref .section-error').html(chartDataWait).show();
						$http.get('/' + $utils.url.join('api', 'analytics', 'visit', 'ref?') + query)
							.success(function (data) {
								if (data.code === 200 && data.msg.sum) {

									data = data.msg;
									$scope.refSeriesData = data.seriesData;
									$scope.refPieSeriesData = [];
									$scope.refBarSeriesData = [];
									$scope.refTableData = [];
									$scope.refs = [];
									var sum = data.sum;
									for (var i = 0, iLen = $scope.refMap.length; i < iLen; i++) {
										for (var k = 0, kLen = $scope.refSeriesData.length; k < kLen; k++) {
											if ($scope.refSeriesData[k][0] === $scope.refMap[i].key) {
												var refName = $scope.refMap[i].value,
													refValue = $scope.refSeriesData[k][1],
													percentage = Math.round(refValue / sum * 1000) / 10;
												$scope.refPieSeriesData.push([refName, percentage]);
												$scope.refBarSeriesData.push(refValue);
												$scope.refs.push(refName);
												$scope.refTableData.push({
													name: refName,
													value: refValue
												});
											}
										}
									}

									if ($scope.refTableParams) {
										$scope.refTableParams.reload();
									} else {
										$scope.refTableParams = new ngTableParams({
											count: 10, // count per page
											sorting: {
												name: 'asc' // initial sorting
											},
											page: 0
										}, {
											counts: [],
											defaultSort: 'asc',
											getData: function ($defer, params) {
												// debugger
												var orderedData = params.sorting() ?
													$filter('orderBy')($scope.refTableData, params.orderBy()) :
													$scope.refTableData;

												$defer.resolve(orderedData);
											}
										});
									}

									$scope.setRefType('pie');
									$('.ref .section-error').hide();
									$('.ref .section-body').show();
									$('.ref .section-header .fa').show();
								} else {
									$('.ref .section-body').hide();
									$('.ref .section-header .fa').hide();
									$('.ref .section-error').html(chartDataError).show();
								}
								$scope.resizePage();
							})
							.error(function () {
								$('.ref .section-body').hide();
								$('.ref .section-header .fa').hide();
								$('.ref .section-error').html(chartDataError).show();
							});
					};



					$scope.doPage = function (page) {
						$scope.pagination.curPage = page;
						var sIndex = ($scope.pagination.curPage - 1) * $scope.pagination.perPage,
							eIndex = sIndex + $scope.pagination.perPage;
						$scope.trafficTableCategories = $scope.trafficCategoriesReverse.slice(sIndex, eIndex);
					};
					$scope.setRefType = function (refType, $event) {
						if ($event) {
							$('.ref .btn-group label').removeClass('active');
							$($event.target).addClass('active');
						} else {
							$('.ref .btn-group label').removeClass('active');
							$('.ref .btn-group label:first-child').addClass('active');
						}
						if (refType === 'pie') {
							$utils.setPieChart($scope, 'ref', $scope.refPieSeriesData);
						} else if (refType === 'column' || refType === 'bar') {
							// console.log($scope.refBarSeriesData, $scope.refs)
							$utils.setBarChart($scope, 'ref', refType, $scope.refBarSeriesData, $scope.refs);
						}
					};
					function query(st, et) {
						switch (st) {
						case 'today':
							et = (new Date()).getTime();
							st = et;
							break;
						case 'yesterday':
							et = (new Date()).getTime() - 24 * 60 * 60 * 1000;
							st = et;
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
						}
						return {
							st: st,
							et: et
						};
					}
					$scope.init = function () {
						$scope.overviewInit();
						$scope.trafficQuery('week');
						$scope.refQuery('week');
					};
				}]
			};
		}
	]);
});