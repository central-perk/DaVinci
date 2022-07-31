define(['app'], function (app) {
	app.service('$tool', ['config', '$rootScope', '$alert', 'CollectService',
		function (config, $rootScope, $alert, CollectService) {

			// 收藏
			this.collect = function(model, category) {
				CollectService.create({
					modelID: model._id,
					category: category
				}).then(function (data) {
					if (data.code === 200) {
						model.collectID = data.msg;
						$alert.success('收藏成功');
					} else {
						$alert.error(data.msg);
					}
				});
			};

			// 取消收藏
			this.uncollect = function (model) {
				CollectService.remove(model.collectID)
					.then(function (data) {
						if (data.code === 200) {
							model.collectID = null;
							$alert.success(data.msg);
						} else {
							$alert.error(data.msg);
						}
					});
			};
		}
	]);
});