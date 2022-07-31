define([
	'app',
	'pages/data/form/form-data/index',
], function (app) {
	app.directive('dtForm', ['config', '$rootScope', '$routeParams', '$alert', '$http', '$utils',
		function (config, $rootScope, $routeParams, $alert, $http, $utils) {
			var events = config.EVENTS;
			return {
				restrict: 'E',
				templateUrl: '/pages/data/form/index.html',
				// replace: true,
				controller: ['$scope', 'config', function ($scope, config) {
					var contactCols = config.CONTACTS.details;
					$scope.listCheckin = function () {
						$http.get('/api/flyers/' + $scope.flyer._id + '/checkins')
							.success(function (data, status, headers) {
								if (data.code === 200) {
									if (data.msg && !data.msg.count) {
										$scope.noCheckin = true;
										return;
									}
									$scope.checkins = data.msg.checkins;
									$scope.checkinsConfig = data.msg.checkinsConfig;
									$scope.pagination = data.msg.pagination;
									$scope.count = data.msg.count;

									var colSum = _.reduce($scope.checkinsConfig.cols, function (before, field) {
										if (contactCols[field]) {
											return before + contactCols[field].weight;
										} else {
											return before + 2;
										}
									}, 0);

									$scope.colwidthDic = _.reduce($scope.checkinsConfig.cols, function (before, field) {
										if (contactCols[field]) {
											before[field] = contactCols[field].weight / colSum * 100 + '%';
										} else {
											before[field] = 2 / colSum * 100 + '%';
										}
										return before;
									}, {});

								} else {
									$alert.error(data.msg);
								}
							});
					};

					$scope.customInit = function () {
						$http.get('/api/flyers/' + $scope.flyer._id + '/pages/form')
							.success(function (data, status, headers) {
								if (data.code === 200) {
									$scope.flyer = data.msg;
									_.forEach($scope.flyer.content, function (page) {
										if (page.form) {
											$scope.hasCustomCheckin = true;
										}
									});
								} else {
									$alert.error(data.msg);
								}
							});
					};

					$scope.exportForm = function ($event, page, checkins, $index) {
						var columns = _.pluck(page.form, 'label')
							.join(','),
							cols = _.pluck(page.form, 'id')
							.join(',');

						var url = '/api/flyers/' + $scope.flyer._id + '/pages/';
						url += page.id + '/data/form/download?';
						url += $utils.makeQuery({
							columns: columns,
							cols: cols
						});
						window.open(url);

						$event.preventDefault();
						$event.stopPropagation();
						return false;
					};

					// $scope.listCheckin();
					$scope.customInit();
				}]
			};
		}
	]);
});