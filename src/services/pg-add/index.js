define(['app'], function(app) {
	app.service('$pgAdd', ['$modalService', function($modalService) {
		var pgTplCategorys, allPgTpl;

		// 获取模板页面
		function init() {
			pgTplCategorys = [{
				label: '全部',
				key: 'all'
			}, {
				label: '组件',
				key: 'cpt'
			}, {
				label: '自定义',
				key: 'custom'
			}];

			allPgTpl = {
				all: [{
					_t: 'text',
					name: '自定义模板',
					kind: 'custom'
				}, {
					_t: 'text',
					name: '图文'
				}],
				cpt: [{
					_t: 'text',
					name: '图文'
				}, {
					_t: 'slider',
					name: '幻灯片'
				}, {
					_t: 'video',
					name: '视频'
				}, {
					_t: 'intro',
					name: '名片'
				}, {
					_t: 'map',
					name: '地图'
				}, {
					_t: 'checkin',
					name: '登记'
				}],
				custom: [{
					_t: 'text',
					name: '自定义模板',
					kind: 'custom'
				}]
			};
		}
		init();

		this.show = function(callback) {
			$modalService.show({
				templateUrl: '/services/pg-add/index.html',
				width: 600,
				controller: ['$scope', '$modalInstance', '$pgData',
					function($scope, $modalInstance, $pgData) {
						$scope.pgTplCategorys = pgTplCategorys;
						$scope.allPgTpl = allPgTpl;

						// 选择页面模板类型
						$scope.chooseCategory = function(category) {
							$scope.activeCategory.active = false;
							category.active = true;
							$scope.activeCategory = category;

							$scope.tpls = $scope.allPgTpl[category.key];
						};

						// 默认选择第一类页面模板
						$scope.activeCategory = $scope.pgTplCategorys[0];
						$scope.chooseCategory($scope.pgTplCategorys[0]);

						// 创建页面
						$scope.createPg = function(tpl) {
							if (tpl.kind) {
								createCustomPg(tpl);
							} else {
								createCommonPg(tpl);
							}
						};

						// 创建自定义页面
						function createCustomPg(tpl) {
							$pgData.createCustomPage({}, function(_page) {
								//创建页面
								callback({
									page: _page
								});
								$scope.close();
							});
						}

						// 创建普通页面
						function createCommonPg(tpl) {
							if(tpl.disabled) return;

							$pgData.createPage({
								_t: tpl._t
							}, function(_page) {
								//创建页面
								callback({
									page: _page
								});
								$scope.close();
							});
						}


						$scope.close = function() {
							$modalInstance.close();
						};
					}
				]
			});
		};
	}]);
});