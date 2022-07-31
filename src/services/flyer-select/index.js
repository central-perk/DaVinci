/**
 *  窗口-选择作品
 *
 */
define(['app'], function (app) {
	app.service('$flyerSelect', ['config', '$http', '$modalService', '$alert',
        function (config, $http, $modalService, $alert) {
			// 展示
			this.init = function (options, callback) {

				$modalService.show({
					templateUrl: '/services/flyer-select/index.html',
					windowClass: 'svs-flyer-select',
					width: 600,
					marginTop: 150,
					controller: ['config', '$scope', '$rootScope', '$modalInstance', '$validator', '$utils',
                        function (config, $scope, $rootScope, $modalInstance, $validator, $utils) {
							$scope.query = {};

							$scope.init = function () {

									$scope.searchFlyer();
								}
								//


							$scope.do = function () {
								callback($scope.targetFlyer);
								$scope.close();
							};

							//已发布且启用作品
							$scope.listRunningFlyer = function (_query) {
								var _query = _query || {};
								angular.extend(_query, $scope.query);
								var queryStr = $utils.makeQuery(_query);
								$http({
									method: 'get',
									url: '/api/flyers/undraft?' + queryStr
								}).
								success(function (data, status, headers, config) {
									if (data.code === 200) {
										$scope.flyers = data.msg.flyers;
										$scope.pagination = data.msg.pagination;
										$scope.count = data.msg.count;
									} else {
										$alert.error(data.msg);
									}
								});
							}
							$scope.searchFlyer = function () {
								$scope.listRunningFlyer();
							}
							$scope.chooseFlyer = function (f) {
								$scope.targetFlyer = f;
							}
							$scope.search = function (page) {
									$scope.query.page = page;
									$scope.listRunningFlyer();
								}
								//关闭按钮
							$scope.close = function () {
								$modalInstance.close();
							};

                        }
                    ]
				});

			}


        }
    ]);
});