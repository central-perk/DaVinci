define(['app'], function (app) {
	//作品相关操作容器
	app.service('$pgTemplateAdd', ['config', '$modalService', '$q', '$pgAddCustom',
        function factory(config, $modalService, $q, $pgAddCustom) {
			var events = config.EVENTS;
			var pageTemplateConfig = config.TEMPLATES.page;

			this.init = function (options) {
				var page = options.page,
					flyerID = options.flyerID;
				var delay = $q.defer();
				$modalService.show({
					templateUrl: '/services/pg-template-add/index.html',
					width: 600,
					height: 523,
					controller: ['$scope', '$modalInstance', 'PageTemplateService', '$imageManage', '$alert',
                        function ($scope, $modalInstance, PageTemplateService, $imageManage, $alert) {
							if (!options._id) {
								$scope.template = {
									page: page,
									flyerID: flyerID,
									name: '页面模板',
									cover: 'http://img.xiami.net/images/album/img90/1390/4219811420361131_2.jpg',
									sort: ($pgAddCustom.getTplLen() + 1) * 5
								};
								$scope.save = function () {
									$scope.template.tags = $scope.getTags();
									PageTemplateService.create($scope.template).then(function () {
										$alert.success('创建页面模板成功');
										$pgAddCustom.initTemplates();
										$scope.close();
									});
								};
							} else {
								$scope.template = options;
								$scope.save = function () {
									$scope.template.tags = $scope.getTags();
									PageTemplateService.update($scope.template._id, $scope.template).then(function (data) {
										$alert.success('修改页面模板成功');
										_.merge($scope.template, data.msg);
										$scope.close();
									});
								};
							}
							$scope.getTags = function () {
								var tags = [];
								for (var i = 0; i < $scope.data.selectedTags.length; i++) {
									tags.push($scope.data.selectedTags[i].tag);
								};
								return tags;
							};
							$scope.init = function () {
								$scope.data = {}
								var selectedTags = [];
								var tags = [];
								for (var key in pageTemplateConfig.tags) {
									var tag = pageTemplateConfig.tags[key];
									tags.push({
										tag: tag.tag,
										name: tag.name
									});
								};
								$scope.tags = tags;
								if (options._id) {
									var selectedTags = [];
									for (var i = 0; i < $scope.template.tags.length; i++) {
										selectedTags.push({
											tag: $scope.template.tags[i],
											name: pageTemplateConfig.tags[$scope.template.tags[i]].name
										});
									};
									$scope.data.selectedTags = selectedTags;
									$scope.selected = selectedTags;
								}
							}
							$scope.init();
							$scope.close = function () {
								$modalInstance.close();
							}
							$scope.setCover = function () {
								$imageManage.init({
									title: '设置封面',
									ratio: 0.632,
									disableDynamic: true,
									disableMulti: true
								}).then(function (result) {
									$scope.template.cover = result[0].cropUrl;
								});
							}
                        }
                    ]
				});
				return delay.promise;
			};
        }
    ]);
});