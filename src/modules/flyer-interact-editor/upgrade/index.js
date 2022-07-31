define(['app'], function(app) {
	app.service('$flyerUpgrade', ['$q', '$alert', '$utils', '$confirm', '$layerManage', 'config', '$layerManage', 'FlyerService',
		function($q, $alert, $utils, $confirm, $layerManage, config, $layerManage, FlyerService) {
			this.v1 = function(flyer) {
				var delay = $q.defer();
				var pages = flyer.content;
				var version = 1434527045401;
				for (var i = 0, pagesLen = pages.length; i < pagesLen; i++) {
					if (pages[i]) {
						if (pages[i].kind === 'custome') {
							//layer补充pageid
							pages[i] = $layerManage.initLayerPageID(pages[i]);
						} else if (!pages[i].kind || pages[i].kind === 'std') {
							//存在组件页面，给予提示
							existStdPageHelp(flyer, delay);
							return delay.promise;
						}
					}
				}
				var fixFlag = flyer.updatedTime && new Date(flyer.updatedTime).getTime() < version;
				if (fixFlag) {
					angular.element(document).ready(function() {
						v1FixedFlyer(flyer);
						FlyerService.updateContent(flyer._id, {
								pages: flyer.content
							})
							.then(function(data) {
								if (data.code === 200) {
									console.log('[Upgrade succeed]');
								} else {
									console.log('[Upgrade error]');
								}
							});
					});
				} else {
					console.log('[Not need Upgrade]');
				}
				flyer.content = pages;
				delay.resolve();
				return delay.promise;
			};

			function v1FixedFlyer(flyer) {
				var pages = flyer.content;
				for (var i = 0, iLen = pages.length; i < iLen; i++) {
					pages[i] = v1FixedPage(pages[i]);
				}
				flyer.content = pages;
			}

			function v1FixedPage(page) {
				var layers = page.layers;
				for (var i = 0, iLen = layers.length; i < iLen; i++) {
					var layer = layers[i];
					if ($layerManage.isText(layer)) {
						$layerManage.resizeVerticalPostion(layer);
						layers[i] = layer;
					}
				}
				page.layers = layers;
				return page;
			}

			function existStdPageHelp(flyer, delay) {
				$confirm.init({
						backdrop: 'static',
						modal: {
							title: '温馨提示',
							lock: true,
							body: '<p style="line-height:30px;text-indent: 2em;">当前作品包含组件页面，不再支持修改和发布！但您依然可以查看它的在线地址<a href="' + flyer.link + '" target="_blank">' + flyer.link + '</a>，为了您制作更加精美流畅的作品，请重新创建新的作品,<a href="/templates" target="_self">  即刻创建。</a></p>'
						},
						btnConfirm: {
							class: 'btn-default',
							name: '关闭',
							hide: true
						},
						btnClose: {
							hide: true
						},
						btnHeadClose: {
							hide: true
						}
					})
					.then(function() {

					});
				delay.reject();
			}
		}
	]);
});