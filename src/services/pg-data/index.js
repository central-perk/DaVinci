define(['app'], function(app) {
	var pages;
	app.service('$pgData', ['config', '$http', '$utils', 'PageTemplateService', '$layerManage',
		function(config, $http, $utils, PageTemplateService, $layerManage) {
			var flyerPages,
				pageDatas,
				pagesConfig = config.CPTS[config.FLYERS.categorys.interact],
				stdPages,
				checkinPageIndex;
			//作品初始化pg-data配置
			this.init = function(options) {
				this.flyer = options.flyer;
			};

			this.getFlyer = function(){
				return this.flyer;
			};
			
			// this.setFlyer = function(flyer){
			// 	this.flyer = flyer;
			// };
			//设置当前页面
			this.setPages = function(_flyerPages) {
				flyerPages = _flyerPages;
			};

			this.getSelectPages = function() {
				var pages = [];
				for (var i = 0, iLen = flyerPages.length; i < iLen; i++) {
					pages.push({
						name: '第' + (i + 1) + '页',
						id: flyerPages[i].id
					});
				};
				return pages;
			};
			this.getStdPages = function() {
				return stdPages;
			};
			//获取不同类型页面的模板
			this.getPageDatas = function(cb) {
				if (pageDatas) return cb();
				$http({
					method: 'get',
					url: '/api/flyer/pages'
				})
					.
				success(function(data, status, headers, config) {
					if (data.code === 200) {
						pageDatas = data.msg;
						cb();
					} else {
						$alert.error(data.msg);
					}
				});
			};
			//安装插件
			this.installEffect = function(data, effects) {
				//装载插件
				for (var index in effects) {
					var effectName = effects[index];
					data[effectName] = angular.copy(pageDatas[effectName].data);
				}
				return data;
			};
			//初始化表单提示值
			this.installPlaceHolder = function(data) {
				var baseData = angular.copy(pageDatas.base.data);
				if (_.isArray(data._placeholder)) {
					var _placeholder;
					_placeholder = _.reduce(data._placeholder, function(result, value) {
						result[value] = baseData._placeholder[value];
						return result;
					}, {});
					data._placeholder = _placeholder;
				}
				return data;
			};
			this.installPic = function(data) {
				var baseData = angular.copy(pageDatas.base.data);
				data.picConfig = baseData.picConfig;
				return data;
			};
			this.createPageID = function() {
				var self = this,
					_pageID = 'page-' + $utils.createToken();
				if (flyerPages.length === 0) {
					return _pageID;
				} else {
					for (var i = 0; i < flyerPages.length; i++) {
						if (flyerPages[i].id === _pageID) {
							return self.createPageID();
						}
						if (i === 0) {
							return _pageID;
						}
					}
				}
			};
			//安装ID
			this.installID = function(data) {
				//创建pageID
				var ids = {};
				data.id = this.createPageID();
				var pageIdPrefix = data.id + '-';
				//默认创建layer的_id
				for (var i = 0; i < data.layers.length; i++) {
					var layerId = pageIdPrefix + data.layers[i].name;
					data.layers[i].id = layerId;
					ids[data.layers[i].name] = layerId;
				}
				//默认创建bg的id
				data.bg.id = pageIdPrefix + data.bg.name;
				ids.bg = data.bg.id;
				//创建插件id
				for (var index in data.plugins) {
					var plugin = data.plugins[index];
					var pluginId = pageIdPrefix + plugin;
					data[plugin] = data[plugin] || {};
					data[plugin].id = pluginId;
					ids[plugin] = pluginId;
				}
				data.ids = ids;
				return data;
			};
			// this.initPageBg = function(options) {
			//     var _page = options.page,
			//         _defaultBg = $design.feelDefaultBg();
			//     _page.bg.customSwitch = false;
			//     _page.bg.category = _defaultBg.category;
			//     _page.bg.key = _defaultBg.key;
			//     _page.bg.value = _defaultBg.uri;
			//     return _page;
			// };

			function initSelected() {
				return true;
			}
			//创建元数据
			this.createPage = function(options, callback) {
				var self = this;
				self.getPageDatas(function() {
					var data = {};
					if (options._t === pagesConfig.cover._t) {
						data = angular.copy(pageDatas.text.data);
					} else {
						data = angular.copy(pageDatas[options._t].data);
					}
					data.kind = 'std';
					data.selected = initSelected();
					//封面特殊处理
					//if (options._t === pagesConfig.cover._t) {
					// data.cover = true;
					var baseData = angular.copy(pageDatas.base.data);
					data.bg = baseData.bg;
					data.effect = baseData.effect;
					var effects = effects || [];
					effects.push('mask');
					effects.push('fpscan');
					//}
					data = self.installEffect(data, effects);
					data = self.installPlaceHolder(data);
					data = self.installID(data);
					data = self.installPic(data);
					callback(data);
				});
			};


			this._createCustomBlankPage = function(tpl, callback) {
				var self = this;
				self.getPageDatas(function() {
					data = {
						"kind": 'custome', //页面模板标示，与页面组件区分开
						"properties": null, //页面其他属性，待确定
						"layers": []
					};
					data.selected = initSelected();
					var baseData = angular.copy(pageDatas.base.data);
					data.bg = baseData.bg;
					data.animates = {
						"bg": {
							"effect": {
								"type": "none",
								"orientation": "horizontal"
							},
							"switch": false
						}
					};
					data.effect = baseData.effect;
					var effects = effects || [];
					effects.push('mask');
					effects.push('fpscan');
					data = self.installEffect(data, effects);
					data = self.installID(data);
					callback(data);
				});
			};

			this._uniquePageID = function(page) {
				var pages = flyerPages;
				for (var i = 0; i < pages.length; i++) {
					if (pages[i].id === page.id) {
						page.id = 'page-' + $utils.createToken();
						this._uniquePageID(page);
						page = $layerManage.initLayerPageID(page);
					}
				}
			};

			this._createCustomPageByTpl = function(tpl, callback) {
				var self = this;
				PageTemplateService.get(tpl._id)
					.then(function(result) {
						if (!result.msg) {
							return self._createCustomBlankPage(tpl, callback);
						}
						var data = result.msg;
						self._uniquePageID(data);
						data.bg.id = data.id + '-' + data.bg.name;
						data.selected = initSelected();
						data.tplID = tpl._id;
						callback(data);
					});
			};
			this.createCustomPage = function(options, callback) {
				var self = this;
				var tpl = options.tpl;
				if (!tpl || (tpl && !tpl._id)) {
					self._createCustomBlankPage(tpl, callback);
				} else {
					self._createCustomPageByTpl(tpl, callback);
				}
			};
		}
	]);
});