//图层管理服务
define([
	'app'
], function(app) {
	app.service('$layerManage', ['$affirm', '$utils', 'config', '$alert', '$rootScope', function($affirm, $utils, config, $alert, $rootScope) {
		var events = config.EVENTS;

		var layerInfo = {
			zMin: 10
		};
		var customeConfig = config.CPTS[config.FLYERS.categorys.interact].custome;

		var self = this;

		this.setCurLayer = function(layer) {
			this.curLayer = layer;
		};

		this.getCurLayer = function(layer) {
			return this.curLayer;
		};

		// 当前选中层上移
		this.moveUp = function(layer, distance) {
			distance = distance || 1;
			layer.style.y -= distance;
		};

		this.moveDown = function(layer, distance) {
			distance = distance || 1;
			layer.style.y += distance;
		};

		this.moveLeft = function(layer, distance) {
			distance = distance || 1;
			layer.style.x -= distance;
		};

		this.moveRight = function(layer, distance) {
			distance = distance || 1;
			layer.style.x += distance;
		};


		this.init = function(page) {
			this.page = page;
			// 初始化z-index管理
			this.updatezManage();
		};

		//设置layer页面pageID
		this.initLayerPageID = function(page) {
			var layers = page.layers;
			for (var j = 0; j < layers.length; j++) {
				if (!layers[j].pageid) {
					layers[j].pageid = page.id;
				}
			}
			page.layers = layers;
			return page;
		};

		this.getPage = function() {
			return this.page;
		};

		//获取图层链接
		this.getLinkVal = function(link) {
			if (!link) return;
			if (link.type === 'web') {
				return link.web;
			} else if (link.type === 'tel') {
				return link.tel;
			} else if (link.type === 'page') {
				return link.pageID;
			} else {
				return '';
			}
		};

		this.getLinkType = function(layer) {
			var type;
			if (layer.asSubmitBtn === true) {
				return 'btn';
			} else {
				return layer.link ? layer.link.type : 'none';
			}
		};

		this.setLayerEditor = function(editor) {
			this.editor = editor;
		};
		this.getLayerEditor = function() {
			return this.editor;
		};
		this.bringLayerTop = function(layer) {
			this.page.layers = bringLayerTop(this.page.layers, layer);
		};
		this.bringLayerBottom = function(layer) {
			this.page.layers = bringLayerBottom(this.page.layers, layer);
		};
		this.bringLayerUp = function(layer) {
			this.page.layers = bringLayerUp(this.page.layers, layer);
		};
		this.bringLayerDown = function(layer) {
			this.page.layers = bringLayerDown(this.page.layers, layer);
		};

		this.rmLayer = function(layer, dirRmFlag) {
			if (dirRmFlag) {
				this._rmLayer(layer);
				return;
			}
			var self = this;
			var name = layer.name;
			if (this.isText(layer)) {
				name = $utils.rmHtmlTag(layer.content.text) ? '' : layer.name;
			}
			var msg = '确认删除图层？';
			if (this.isIbox(layer)) {
				msg = '警告：删除后数据将无法恢复';
			}
			$affirm.show({
				msg: msg,
				btnConfirm: {
					label: '删除'
				}
			}).then(function() {
				self._rmLayer(layer);
				$rootScope.$broadcast(events.pageBgClick, {
					action: 'chooseBg'
				});
			});
		};

		this._rmLayer = function(layer) {
			for (var i = 0; i < this.page.layers.length; i++) {
				if (layer.id === this.page.layers[i].id) {
					this.page.layers.splice(i, 1);
					break;
				}
			}
			return this.reindexLayers(this.page.layers);
		};

		this.createLayerID = function() {
			var self = this,
				layers = this.page.content || [],
				layerID = 'layer-' + $utils.createToken();
			if (layers.length === 0) {
				return layerID;
			} else {
				for (var i = 0; i < layers.length; i++) {
					if (layers[i].id === layerID) {
						return self.createLayerID();
					}
					if (i === 0) {
						return layerID;
					}
				}
			}
		};

		// 勿删
		// var layerDefault = {
		// 	style: { //层容器样式
		// 		width: 150,
		// 		height: 100,
		// 		x: 85,
		// 		y: 203,
		// 		rotateZ: 0,
		// 		zIndex: self.getNextzIndex()
		// 	},
		// 	animate: $layerAnimate.getDefaultAnimate('fadeIn'),
		// }

		//增加layer
		this.addLayer = function(layer) {
			layer._new = true;
			layer.name = this.getLayerNewName(layer);
			layer.id = this.createLayerID();
			layer.pageid = this.page.id;
			this.page.layers.push(layer);

			// this.updateLayerCount(layer);
			this.updatezManage();
			this.page.layers = this.resortLayers(this.page.layers);
			if (this.isText(layer)) {
				$alert.success('创建文本成功');
			} else if (this.isImage(layer)) {
				$alert.success('创建图片成功');
			} else if (this.isIbox(layer)) {
				$alert.success('创建输入框成功');
			} else if (this.isMap(layer)) {
				$alert.success('创建地图成功');
			} else if (this.isVideo(layer)) {
				$alert.success('创建视频成功');
			} else if (this.isSlider(layer)) {
				$alert.success('创建幻灯片成功');
			} else if (this.isShape(layer)) {
				$alert.success('创建形状成功');
			}

		};

		this.isSelected = function(layer) {
			return layer && layer.active;
		};

		this.select = function(layer) {
			layer.active = true;
		};

		this.unSelect = function(layer) {
			layer.active = false;
		};
		//判断文本类型
		this.isText = function(layer) {
			return layer && layer.type === customeConfig.text.type;
		};
		//判断图片类型
		this.isImage = function(layer) {
			return layer && layer.type === customeConfig.image.type;
		};

		this.isIbox = function(layer) {
			return layer && layer.type === customeConfig.ibox.type;
		};

		this.isMap = function(layer) {
			return layer && layer.type === customeConfig.map.type;
		};

		this.isVideo = function(layer) {
			return layer && layer.type === customeConfig.video.type;
		};

		this.isSlider = function(layer) {
			return layer && layer.type === customeConfig.slider.type;
		};

		this.isShape = function(layer) {
			return layer && layer.type === customeConfig.shape.type;
		};

		this.isEditText = function(layer) {
			return layer && layer.state === 1;
		};

		// this.updateLayerCount = function(layer) {
		// 	if (this.isText(layer)) {
		// 		return this.updateTextCount(layer);
		// 	} else if (this.isImage(layer)) {
		// 		return this.updateImageCount(layer);
		// 	}
		// };

		this.getLayerNewName = function(layer) {
			if (this.isText(layer)) {
				return this.getTextNewName(layer);
			} else if (this.isImage(layer)) {
				return this.getImageNewName(layer);
			} else if (this.isIbox(layer)) {
				return this.getIboxNewName(layer);
			} else if (this.isMap(layer)) {
				return this.getMapNewName(layer);
			} else if (this.isVideo(layer)) {
				return this.getVideoNewName(layer);
			} else if (this.isSlider(layer)) {
				return this.getSliderNewName(layer);
			} else if (this.isShape(layer)) {
				return this.getShapeNewName(layer);
			}
		};

		// this.updateTextCount = function() {
		// 	this.page.count = this.page.count || {};
		// 	if (!this.page.count.text) this.page.count.text = 1;
		// 	this.page.count.text++;
		// };
		// this.updateImageCount = function() {
		// 	this.page.count = this.page.count || {};
		// 	this.page.count.image++;
		// };
		this.getImageNewName = function() {
			if (!this.page.count.image) {
				this.page.count.image = 1;
			} else {
				this.page.count.image += 1;
			}
			return customeConfig.image.name + this.page.count.image;
		};

		this.getTextNewName = function() {
			if (!this.page.count.text) {
				this.page.count.text = 1;
			} else {
				this.page.count.text += 1;
			}
			return customeConfig.text.name + this.page.count.text;
		};

		this.getIboxNewName = function() {
			if (!this.page.count.ibox) {
				this.page.count.ibox = 1;
			} else {
				this.page.count.ibox += 1;
			}
			return customeConfig.ibox.name + this.page.count.ibox;
		};

		this.getMapNewName = function() {
			if (!this.page.count.map) {
				this.page.count.map = 1;
			} else {
				this.page.count.map += 1;
			}
			return customeConfig.map.name + this.page.count.map;
		};

		this.getVideoNewName = function() {
			if (!this.page.count.video) {
				this.page.count.video = 1;
			} else {
				this.page.count.video += 1;
			}
			return customeConfig.video.name + this.page.count.video;
		};

		this.getSliderNewName = function() {
			if (!this.page.count.slider) {
				this.page.count.slider = 1;
			} else {
				this.page.count.slider += 1;
			}
			return customeConfig.slider.name + this.page.count.slider;
		};

		this.getShapeNewName = function() {
			if (!this.page.count.shape) {
				this.page.count.shape = 1;
			} else {
				this.page.count.shape += 1;
			}
			return customeConfig.shape.name + this.page.count.shape;
		};

		this.getNextzIndex = function() {
			this.updatezManage();

			// 有图层则为zMax+1，没有图层则为zMin
			if (layerInfo.len) {
				return layerInfo.zMax + 1;
			} else {
				return layerInfo.zMin;
			}
		};

		//文本－对齐（Y）或高度发生变化
		this.resizeVerticalPostion = function(layer) {
			if (!layer) {
				return;
			}
			var paddingTop,
				marginTop = 0,
				innerHeight = 0,
				$layerContent = $('.thumbs #' + layer.pageid + ' #' + layer.id).find('.content'),
				ctFtSize = parseInt(($layerContent.css('font-size') || '14px').replace('px', '')),
				childNodes = $layerContent[0] ? $layerContent[0].childNodes : [];
			layer.content.editorStyle = layer.content.editorStyle || {};
			var verticalAlign = layer.content.editorStyle.verticalAlign;
			if (childNodes.length > 0) {
				for (var i = 0; i < childNodes.length; i++) {
					var node = childNodes[i];
					if (node.nodeType === 3) {
						innerHeight = innerHeight + ctFtSize;
					} else if (node.nodeType === 1) {
						innerHeight = innerHeight + $(node).height();
					}
				}
			}
			if (!innerHeight) {
				innerHeight = ctFtSize;
			}
			if (verticalAlign === 'middle') {
				paddingTop = (layer.style.height - innerHeight) / 2;
				if (layer.style.height < innerHeight) {
					marginTop = paddingTop;
					paddingTop = 0;
				}
			} else if (verticalAlign === 'top') {
				paddingTop = 0;
			} else if (verticalAlign === 'bottom') {
				paddingTop = (layer.style.height - innerHeight);
			}
			if (paddingTop <= 0) {
				paddingTop = 0;
			}
			if (paddingTop || paddingTop === 0) {
				layer.content.editorStyle.paddingTop = paddingTop;
			}
			if (marginTop || marginTop === 0) {
				layer.content.editorStyle.marginTop = marginTop;
			}
		};

		this.syncTextHtml = function(editor, layer) {
			// if (!editor || !layer) return;
			// layer.content.text = editor.getHTML();
			// var $layerInPgThumb = $('.thumbs #' + this.page.id + ' #' + layer.id)
			// 	.find('.text .content');
			// $layerInPgThumb.html(layer.content.text);
		};
		// layer manage

		// 更新layer的长度，最大zIndex，最小zIndex
		// 在create、rm以及切换page的时候需要触发

		this.updatezManage = function() {
			layerInfo.len = this.page.layers.length;
			// 没有图层或者有一层时，zMax按照zMin计算
			if (layerInfo.len > 1) {
				layerInfo.zMax = layerInfo.zMin + layerInfo.len - 1;
			} else {
				layerInfo.zMax = layerInfo.zMin;
			}
		};

		// layer置顶
		function bringLayerTop(layers, layer) {
			var layerzIndex = layer.style.zIndex,
				zMin = layerInfo.zMin,
				zMax = layerInfo.zMax,
				layersLen = layerInfo.len;
			if (layerzIndex < zMin || layerzIndex > zMax) {
				console.log('layer z-index error!');
				return layers;
			}

			for (var i = 0; i < layersLen; i++) {
				if (layers[i].style.zIndex > layerzIndex) {
					layers[i].style.zIndex--;
				} else if (layers[i].style.zIndex === layerzIndex) {
					layers[i].style.zIndex = zMax;
				}
			}
			return resortLayers(layers);
		}

		// layer置底部
		function bringLayerBottom(layers, layer) {
			var layerzIndex = layer.style.zIndex,
				zMin = layerInfo.zMin,
				zMax = layerInfo.zMax,
				layersLen = layerInfo.len;
			if (layerzIndex < zMin || layerzIndex > zMax) {
				console.log('layer z-index error!');
				return layers;
			}

			for (var i = 0; i < layersLen; i++) {
				if (layers[i].style.zIndex < layerzIndex) {
					layers[i].style.zIndex++;
				} else if (layers[i].style.zIndex === layerzIndex) {
					layers[i].style.zIndex = zMin;
				}
			}
			return resortLayers(layers);
		}

		// layer上移一层
		function bringLayerUp(layers, layer) {
			var layerzIndex = angular.copy(layer.style.zIndex),
				zMin = layerInfo.zMin,
				zMax = layerInfo.zMax,
				layersLen = layerInfo.len;
			if (layerzIndex < zMin || layerzIndex > zMax) {
				console.log('layer z-index error!');
				return layers;
			}

			// 已经在顶部则不必操作
			if (layerzIndex === zMax) {
				return layers;
			}

			for (var i = 0; i < layersLen; i++) {
				if (layers[i].style.zIndex === layerzIndex) {
					layers[i].style.zIndex++;
				} else if (layers[i].style.zIndex === layerzIndex + 1) {
					layers[i].style.zIndex--;
				}
			}
			return resortLayers(layers);
		}

		// layer下移一层
		function bringLayerDown(layers, layer) {
			var layerzIndex = angular.copy(layer.style.zIndex),
				zMin = layerInfo.zMin,
				zMax = layerInfo.zMax,
				layersLen = layerInfo.len;
			if (layerzIndex < zMin || layerzIndex > zMax) {
				console.log('layer z-index error!');
				return layers;
			}

			// 已经在底部则不必操作
			if (layerzIndex === zMin) {
				return layers;
			}

			for (var i = 0; i < layersLen; i++) {
				if (layers[i].style.zIndex === layerzIndex) {
					layers[i].style.zIndex--;
				} else if (layers[i].style.zIndex === layerzIndex - 1) {
					layers[i].style.zIndex++;
				}
			}
			return resortLayers(layers);
		}

		// 重置zIndex
		this.reindexLayers = function(layers) {
			this.updatezManage();

			var zMin = layerInfo.zMin,
				zMax = layerInfo.zMax,
				layersLen = layerInfo.len;
			for (var i = 0; i < layersLen; i++) {
				layers[i].style.zIndex = zMax - i;
			}
			return layers;
		};

		// 重排列zIndex
		function resortLayers(layers) {

			return _.sortBy(layers, function(layer) {
				return -(layer.style.zIndex);
			});
		}

		this.resortLayers = resortLayers;


	}]);
});