define(['app', 'modules/layer-container/delta-drag-control'], function (app, DeltaDragControl) {
	app.directive('layerContainer', ['config', '$timeout', '$utils', '$rootScope', '$imageUpload', '$layerClipboard', '$layerAnimate', '$layerManage', '$pgManage', '$imageManage',
		function (config, $timeout, $utils, $rootScope, $imageUpload, $layerClipboard, $layerAnimate, $layerManage, $pgManage, $imageManage) {
			var events = config.EVENTS;
			return {
				restrict: 'AE',
				templateUrl: '/modules/layer-container/index.html',
				scope: {
					layer: '=ngModel'
				},
				replace: true,
				link: function ($scope, $element, $attr) {
					var pgBgClickOff;
					var layerClickOff;
					var fiEditAreaOff;
					var layerQuickClickOff;
					var layerStyleWatchOff;
					var layerStyleHeightWatchOff;
					var layerContentStyleWatchOff;
					var layerContentEditorStyleWatchOff;
					var idSelectdPage = $pgManage.isCurPage($scope.layer.pageid);
					var dropDivPageOffset = $('.drop-div>.page-base')
						.offset();
					var inPgVessl = $element.parents('.mdl-pg-vessel')
						.hasClass('mdl-pg-vessel');
					var transform = window.__DVC.transform;
					var animates = window.__DVC.animates;
					var defaultAnimates = $layerAnimate.getDefaults();
					var Base = {
						origSize: null,
						defaults: {
							scalingClass: 'ui-scaling',
							draggingClass: 'ui-draggable-dragging',
							minMargin: 10
						},
						setDirtyCheck: function (fn) {
							this.dirtyCheck = fn;
						},
						init: function (model, $element) {
							this.model = model;
							this.$element = $element;
						},
						updateOrigin: function (deltas) {
							var offset;
							offset = this.$element.offset();
							this._origin = {
								x: this.$element.width() / 2 + offset.left,
								y: this.$element.height() / 2 + offset.top
							};
						},
						_calcRot: function (point) {
							return Math.atan2(point.y - this._origin.y, point.x - this._origin.x);
						},
						rotate: function (e, deltas) {
							var newRot, rot;
							//计算旋转
							rot = this._calcRot(deltas);
							newRot = this._initialRotate + rot - this._rotOffset;
							newRot = (newRot % (2 * Math.PI)) / (2 * Math.PI) * 360;
							if (newRot < 0) {
								newRot += 360;
							}
							this.dirtyCheck(function () {
								$scope.layer.style.rotateZ = parseInt(newRot);
							});
						},
						rotateStart: function (e, deltas) {
							this.cacheStyle = {};
							this.updateOrigin(deltas);
							this._rotOffset = this._calcRot(deltas);
							this._initialRotate = 0;
						},
						rotateStop: function () {
							// var cmd = new ComponentCommands.Rotate(this._initialRotate, this.model);
							//  undoHistory.push(cmd);
						},
						scaleStart: function (e, deltas) {
							var H, elHeight, elOffset, elWidth, theta;
							$element.addClass(this.defaults.scalingClass);
							this._initialScale = {
								x: 1,
								y: 1
							};
							this._createLayeScaleLabel(e, deltas);
							elOffset = this.$element.offset();
							elWidth = this.$element.width() * this._initialScale.x;
							elHeight = this.$element.height() * this._initialScale.y;
							if (!this.origSize) {
								this.origSize = {
									width: this.$element.width(),
									height: this.$element.height()
								};
							}
							this._scaleDim = {
								width: this._initialScale.x * this.origSize.width,
								height: this._initialScale.y * this.origSize.height,
								theta: theta
							};
							//当前拖拽元素位置
							this._prevPos = {
								x: this.$element.position()
									.left,
								y: this.$element.position()
									.top
							};
							//当前鼠标点击位置
							this._prevMousePos = {
								x: deltas.x,
								y: deltas.y
							};
						},
						//deltas 包含鼠标偏移量和鼠标坐标
						scale: function (e, deltas, direction) {

							//显示宽高度辅助标签
							var position = this.$el.position();

							var scale,
								self = this,
								xChange = false,
								yChange = false,
								newY,
								newX,
								xSignum = 1,
								ySignum = 1,
								labelSizeOffset,
								scaleX,
								scaleY,
								dx = deltas.dx,
								dy = deltas.dy;
							self.cacheStyle = {};
							scaleX = (xSignum * dx + self._scaleDim.width) / (self._scaleDim.width);
							scaleY = (ySignum * dy + self._scaleDim.height) / (self._scaleDim.height);
							if (!direction || (direction === 'se')) {
								//东南
								scale = {
									x: self._initialScale.x * scaleX,
									y: self._initialScale.y * scaleX
								};
							} else if (direction === 's') {
								//南
								if (self.model.force) {
									scale = {
										x: self._initialScale.x * scaleY,
										y: self._initialScale.y * scaleY
									};
								} else {
									scale = {
										x: self._initialScale.x * 1,
										y: self._initialScale.y * scaleY
									};
								}
							} else if (direction === 'sw') {
								scaleX = (-xSignum * dx + self._scaleDim.width) / (self._scaleDim.width);
								//西南
								scale = {
									x: self._initialScale.x * scaleX,
									y: self._initialScale.y * scaleX
								};
								newX = self._prevPos.x - (parseInt(scale.x * self.origSize.width) - self.origSize.width);
								if (scaleX <= 0) {
									return;
								}
							} else if (direction === 'w') {
								scaleX = (-xSignum * dx + self._scaleDim.width) / (self._scaleDim.width);
								//西
								if (self.model.force) {
									scale = {
										x: self._initialScale.x * scaleX,
										y: self._initialScale.y * scaleX
									};
								} else {
									scale = {
										x: self._initialScale.x * scaleX,
										y: self._initialScale.y * 1
									};
								}

								newX = self._prevPos.x - (parseInt(scale.x * self.origSize.width) - self.origSize.width);
								if (scaleX <= 0) {
									return;
								}
							} else if (direction === 'nw') {
								scaleX = (-xSignum * dx + self._scaleDim.width) / (self._scaleDim.width);
								//西北
								scale = {
									x: self._initialScale.x * scaleX,
									y: self._initialScale.y * scaleX
								};
								newY = self._prevPos.y + (self.origSize.height - parseInt(scale.y * self.origSize.height));
								newX = self._prevPos.x + (self.origSize.width - parseInt(scale.x * self.origSize.width));
								if (scaleX <= 0) {
									return;
								}
							} else if (direction === 'n') {
								//北
								scaleY = (-ySignum * dy + self._scaleDim.height) / (self._scaleDim.height);

								if (self.model.force) {
									scale = {
										x: self._initialScale.x * scaleY,
										y: self._initialScale.y * scaleY
									};
								} else {
									scale = {
										x: self._initialScale.x * 1,
										y: self._initialScale.y * scaleY
									};
								}


								newY = self._prevPos.y + (self.origSize.height - parseInt(scale.y * self.origSize.height));
								if (scaleY <= 0) {
									return;
								}
							} else if (direction === 'e') {
								//东
								if (self.model.force) {
									scale = {
										x: self._initialScale.x * scaleX,
										y: self._initialScale.y * scaleX
									};
								} else {
									scale = {
										x: self._initialScale.x * scaleX,
										y: self._initialScale.y * 1
									};
								}
							} else if (direction === 'ne') {
								//东北
								scale = {
									x: self._initialScale.x * scaleX,
									y: self._initialScale.y * scaleX
								};
								newY = self._prevPos.y + (self.origSize.height - parseInt(scale.y * self.origSize.height));
								if (scale.x < 0) {
									return;
								}
							} else {
								return;
							}
							$('#layer-scale-label')
								.show();
							this._refreshLayerScaleLabel(e, deltas);

							self.cacheStyle.width = parseInt(scale.x * self.origSize.width);
							self.cacheStyle.height = parseInt(scale.y * self.origSize.height);
							self.cacheStyle.x = parseInt(newX);
							self.cacheStyle.y = parseInt(newY);
							$scope.$apply(function () {
								self.model.style.width = self.cacheStyle.width;
								self.model.style.height = self.cacheStyle.height;
								if (self.cacheStyle.x) {
									self.model.style.x = self.cacheStyle.x;
								}
								if (self.cacheStyle.y) {
									self.model.style.y = self.cacheStyle.y;
								}
							});
							// self._refreshPosition();
						},
						//重新渲染位置
						_refreshPosition: function () {
							var self = this;
							if (self.cacheStyle.width && self.cacheStyle.height) {
								self.$element.css({
									'width': self.cacheStyle.width + 'px',
									'height': self.cacheStyle.height + 'px'
								});
							}
							if (self.cacheStyle.x) {
								transform.css(self.$element[0], {
									x: self.cacheStyle.x
								});
							}
							if (self.cacheStyle.y) {
								transform.css(self.$element[0], {
									y: self.cacheStyle.y
								});
							}
							if (self.cacheStyle.rotateZ) {
								transform.css(self.$element[0], {
									rotateZ: self.cacheStyle.rotateZ
								});
							}
						},
						//停止缩放
						scaleStop: function () {
							var self = this;
							// var cmd = new ComponentCommands.Scale(self._initialScale, this.model);
							// undoHistory.push(cmd);
							$element.removeClass(this.defaults.scalingClass);
							$('#layer-scale-label')
								.remove();
							self.origSize = null;
						},
						_createLayeScaleLabel: function (e, deltas) {
							if ($('#layer-scale-label')
								.html()) {
								$('#layer-scale-label')
									.hide();
								this._refreshLayerScaleLabel(e, deltas);
								return;
							}
							$('body')
								.append('<div id="layer-scale-label" style="display:none;" class="layer-label layer-scale-label">' +
									'<div class="measure"><span class="name">宽&nbsp;:&nbsp;</span><span class="w"></span><span class="unit">px</span></div>' +
									'<div class="measure"><span class="name">高&nbsp;:&nbsp;</span><span class="h"></span><span class="unit">px</span></div>' +
									'</div>');
							this._refreshLayerScaleLabel(e, deltas);
						},
						_refreshLayerScaleLabel: function (e, deltas) {
							$('#layer-scale-label')
								.css({
									left: deltas.x + 20,
									top: deltas.y - 50
								});
							$('#layer-scale-label')
								.find('.w')
								.text(this.model.style.width);
							$('#layer-scale-label')
								.find('.h')
								.text(this.model.style.height);
						},
						//创建拖拽提示
						_createLayerDragLabel: function (e, deltas) {
							if ($('#layer-drag-label')
								.html()) {
								this._refreshLayerDragLabel(e, deltas);
								return;
							}
							$('body')
								.append('<div id="layer-drag-label" style="display:none;" class="layer-label layer-drag-label">' +
									'<div class="measure"><span class="name">x&nbsp;:</span><span class="x"></span><span class="unit">px</span></div>' +
									'<div class="measure"><span class="name">y&nbsp;:</span><span class="y"></span><span class="unit">px</span></div>' +
									'</div>');
							this._refreshLayerDragLabel(e, deltas);
						},
						//刷新拖拽提示
						_refreshLayerDragLabel: function (e, deltas) {
							$('#layer-drag-label')
								.css({
									left: deltas.x + 20,
									top: deltas.y - 50
								});
							$('#layer-drag-label')
								.find('.x')
								.text(this.model.style.x);
							$('#layer-drag-label')
								.find('.y')
								.text(this.model.style.y);
						},
						dragStart: function (e, deltas) {
							var position = this.$el.position();
							this._createLayerDragLabel(e, deltas);
							this._prevPos = {
								x: this.model.style.x,
								y: this.model.style.y
							};
							this._prevMousePos = {
								x: deltas.x,
								y: deltas.y
							};
						},
						//拖拽
						drag: function (e, deltas) {
							this._dragging = true;
							this.$el.addClass(this.defaults.draggingClass);
							$('#layer-drag-label')
								.show();
							this._refreshLayerDragLabel(e, deltas);
							var dx, dy, gridSize, newX, newY, snapToGrid,
								self = this;
							if (this._dragging && !this.model.state) {
								dx = deltas.x - this._prevMousePos.x;
								dy = deltas.y - this._prevMousePos.y;
								newX = this._prevPos.x + dx / 1;
								newY = this._prevPos.y + dy / 1;
								//东西南北10px间距
								if (newX + this.model.style.width <= self.defaults.minMargin) {
									return;
								}

								if (newX >=
									config.SCREEN_SIZE.editor.interact.width - self.defaults.minMargin) {
									return;
								}

								if (newY + this.model.style.height <= self.defaults.minMargin) {
									return;
								}

								if (newY >=
									config.SCREEN_SIZE.editor.interact.height - self.defaults.minMargin) {
									return;
								}


								this.dirtyCheck(function () {
									self.model.style.x = parseInt(newX);
									self.model.style.y = parseInt(newY);
								});
								if (!this.dragStartLoc) {
									this.dragStartLoc = {
										x: newX,
										y: newY
									};
								}
							}
						},
						dragStop: function (e) {
							if (this._dragging) {
								this._dragging = false;
								this.$el.removeClass(this.defaults.draggingClass);
								$('#layer-drag-label')
									.remove();
								// if ((this.dragStartLoc != null) && this.dragStartLoc.x !== this.model.get("x") && this.dragStartLoc.y !== this.model.get("y")) {
								//     undoHistory.pushdo(new ComponentCommands.Move(this.dragStartLoc, this.model));
								// }
								this.dragStartLoc = null;
							}
						}
					};
					//绑定拖拽事件
					var initDragEvent = function () {
						var dragEvents = {
							"deltadragStart": "dragStart",
							"deltadrag": "drag",
							"deltadragStop": "dragStop"
						};
						var deltaDragControl = new DeltaDragControl($element, true);
						for (var key in dragEvents) {
							(function (key) {
								$element.on(key, function (e, deltas) {
									Base.$el = $(this);
									Base[dragEvents[key]](e, deltas);
								});
							}(key));
						}
					};
					//绑定拉伸事件
					var initScaleEvent = function () {
						$element.find('.scale')
							.each(function () {
								var $scaleElem = $(this);
								var deltaDrag = new DeltaDragControl($(this), true);
								$scaleElem.on('deltadragStart', function (e, deltas) {
									Base.$el = $(this);
									Base.scaleStart(e, deltas, $scaleElem.data('direction'));
									return false;
								});
								$scaleElem.on('deltadrag', function (e, deltas) {
									Base.$el = $(this);
									Base.scale(e, deltas, $scaleElem.data('direction'));
									return false;
								});
								$scaleElem.on('deltadragStop', function (e, deltas) {
									Base.$el = $(this);
									Base.scaleStop(e, deltas, $scaleElem.data('direction'));
									return false;
								});
							});
					};
					var initRotateEvent = function () {
						//绑定拉伸事件
						$element.find('.rotate')
							.each(function () {
								var $scaleElem = $(this);
								var deltaDrag = new DeltaDragControl($(this), true);
								$scaleElem.on('deltadragStart', function (e, deltas) {
									Base.$el = $(this);
									Base.rotateStart(e, deltas, $scaleElem.data('direction'));
									return false;
								});
								$scaleElem.on('deltadrag', function (e, deltas) {
									Base.$el = $(this);
									Base.rotate(e, deltas, $scaleElem.data('direction'));
									return false;
								});
								$scaleElem.on('deltadragStop', function (e, deltas) {
									Base.$el = $(this);
									Base.rotateStop(e, deltas, $scaleElem.data('direction'));
									return false;
								});
							});
					};


					//选择层
					$scope.selectLayer = function ($event, layer) {
						if ($layerManage.isSelected(layer)) {
							$rootScope.$broadcast(events.layerClick, {
								action: 'clickLayer',
								layer: $scope.layer
							});
							return;
						}
						$scope._selectLayer(layer);
					};

					$scope._selectLayer = function (layer, _options) {
						var options = _options || {};
						$layerManage.select(layer);
						$rootScope.$broadcast(events.layerClick, {
							layer: layer,
							action: 'chooseLayer',
							init: options
						});

					};

					$scope.isText = $layerManage.isText;
					$scope.isImage = $layerManage.isImage;
					$scope.isIbox = $layerManage.isIbox;
					$scope.isMap = $layerManage.isMap;
					$scope.isVideo = $layerManage.isVideo;
					$scope.isSlider = $layerManage.isSlider;
					$scope.isShape = $layerManage.isShape;



					$scope.isEditText = function (layer) {
						return $layerManage.isEditText(layer);
					};
					$scope.toDblclickLayer = function ($event, layer) {
						if ($scope.isText(layer)) {
							$scope.toEditLayerText(layer);
						} else if ($scope.isImage(layer)) {
							$scope.toEditLayerImage(layer);
						} else if ($scope.isMap(layer)) {
							$scope.toEditLayerImage(layer);
						} else if ($scope.isVideo(layer)) {
							$scope.toEditLayerImage(layer);
						} else if ($scope.isShape(layer)) {
							$timeout(function () {
								$('.edit-area .nav-tabs>li')
									.eq(0)
									.trigger('click');
								$('.btn-replace-shape')
									.click();
							});
						}
						$event.stopPropagation();
						return false;
					};

					$scope.toEditLayerText = function (layer, isFocus) {
						if (!$scope.isText(layer)) return;
						layer.active = true;
						$element.find('.content')
							.attr('contenteditable', true);
						layer.state = 1;
						$rootScope.$broadcast(events.layerClick, {
							action: 'dbClickText',
							layer: $scope.layer
						});
						$element.off('mousedown mousemove mouseup');
					};
					//编辑图片
					$scope.toEditLayerImage = function (layer) {

						$imageManage.init(null, {
								title: '替换图片',
								library: 'user',
								disableMulti: true,
								crop: layer.content.crop
							})
							.then(function (imagePacks) {
								var _crop = imagePacks[0].crop;

								layer.content.pic = imagePacks[0].url;
								layer.content.cropUrl = imagePacks[0].cropUrl;
								layer.content.crop = _crop;
								// 保持裁后图片图片不变形
								if (_crop.w && _crop.h) {
									layer.style.height = Math.round(layer.style.width * _crop.h / _crop.w);
								}
							});

					};
					//取消编辑文本
					$scope.cancelTextEdit = function (layer) {
						if ($scope.isText(layer) && $scope.isEditText(layer)) {
							layer.state = null;
							layer.content.text = $element.find('.content')
								.html();
							$element.find('.content')
								.attr("contenteditable", false);
							initDragEvent();
						}
					};
					var initMsgMonitor = function () {
						//TODO: 消息名写成变量
						layerQuickClickOff = $rootScope.$on('layerQuickClick', function (e, data) {
							if (data.action === 'choose') {
								if (data.layer.id === $scope.layer.id) {
									$scope.layer.active = true;
									$layerManage.setCurLayer($scope.layer);
								} else {
									if ($scope.layer.active) {
										$scope.layer.active = false;
										$scope.cancelTextEdit($scope.layer);
									}
								}
							}
						});
						layerClickOff = $scope.$on(events.layerClick, function (e, data) {
							if (!inPgVessl) return;
							if (data.action === 'chooseLayer' || data.action === 'dbClickText') {

								if (data.layer.id !== $scope.layer.id) {
									if ($scope.isText($scope.layer)) {
										$scope.cancelTextEdit($scope.layer);
									}
									$layerManage.unSelect($scope.layer);
								} else {
									$layerManage.setCurLayer($scope.layer);
								}
							}
						});
						pgBgClickOff = $scope.$on(events.pageBgClick, function (e, data) {
							if (!inPgVessl) return;
							if (data.action === 'chooseBg') {
								if ($scope.isText($scope.layer)) {
									$scope.cancelTextEdit($scope.layer);
								}
								$scope.layer.active = false;
							}
						});
						fiEditAreaOff = $rootScope.$on('fiEditAreaClick', function (e, data) {
							if (!inPgVessl) return;
							if (data.action === 'editLayerImage' && data.layer && $scope.layer.id === data.layer.id) {
								$scope.toEditLayerImage(data.layer);
							}
						});


					};

					var playAnimate = function () {
						var style = $scope.layer.style;
						var animate = $scope.layer.animate;
						// x: style.x,
						// y: style.y,
						// opacity: style.opacity / 100 || 1,
						// scaleX: style.scaleX || 1,
						// scaleY: style.scaleY || 1,
						// rotateZ: style.rotateZ
						if (animate) {
							transform.disableAnimation($element[0]);
							if (animate.type === defaultAnimates.none.type) {
								return;
							}
							var animateType = animates.getAnimateType(animate.type, animate.dir);
							if (!animateType) {
								return;
							}

							animates[animateType].init($element, {
								style: style,
								config: animate
							});

							$timeout(function () {
								animates[animateType].run($element, {
									style: style,
									config: animate
								});
							}, animate.delay * 1000);
							//这儿加500ms，能够让动画之间无冲突
						}
					};
					var cssElementStyle = function () {
						var style = $scope.layer.style;
						$element.attr('style', $utils.getStyleStr(style));
						cssElementContStyle();
					};
					var cssElementContStyle = function () {
						var style = $scope.layer.content.style;
						var options = {
							width: $scope.layer.style.width,
							height: $scope.layer.style.height
						};
						if ($scope.isImage($scope.layer)) {
							$element.find('.image-wrap')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isText($scope.layer)) {
							$element.find('.text')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isIbox($scope.layer)) {
							$element.find('.ibox')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isMap($scope.layer)) {
							$element.find('.map')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isVideo($scope.layer)) {
							$element.find('.video')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isSlider($scope.layer)) {
							$element.find('.slider')
								.attr('style', $utils.getStyleStr(style, options));
						}
						if ($scope.isShape($scope.layer)) {
							$element.find('.shape')
								.attr('style', $utils.getStyleStr(style, options));
						}
					};
					var cssElementContTextStyle = function () {
						if ($scope.isText($scope.layer)) {
							var style = $scope.layer.content.editorStyle;
							$element.find('.text .content')
								.attr('style', $utils.getStyleStr(style));
						}
					};

					var cssElementAllStyle = function () {
						cssElementStyle();
						cssElementContStyle();
						cssElementContTextStyle();
					};
					var initDataWatch = function () {

						//容器样式
						layerStyleWatchOff = $scope.$watch('layer.style', function (newVal, oldVal) {
							if (newVal) {
								cssElementStyle();
							}
						}, true);

						//监听高度
						layerStyleHeightWatchOff = $scope.$watch('layer.style.height', function (newVal, oldVal) {
							if (newVal) {
								if (newVal === oldVal) return;
								if ($scope.isText($scope.layer)) {
									$layerManage.resizeVerticalPostion($scope.layer);
								}
							}
						});

						//监听宽度
						layerStyleHeightWatchOff = $scope.$watch('layer.style.width', function (newVal, oldVal) {
							if (newVal) {
								if (newVal === oldVal) return;
								if ($scope.isText($scope.layer)) {
									$layerManage.resizeVerticalPostion($scope.layer);
								}
							}
						});

						//文本样式
						layerContentStyleWatchOff = $scope.$watch('layer.content.style', function (val) {
							if (val) {
								cssElementContStyle();
							}
						}, true);

						//文本样式
						layerContentEditorStyleWatchOff = $scope.$watch('layer.content.editorStyle', function (val) {
							if (val) {
								cssElementContTextStyle();
							}
						}, true);
					};
					var initAnimate = function () {
						//动画延迟处理
						var playAnimateLastTime;
						var playAnimateInterval = 100;
						var playAnimateTimer;
						var playAnimateCount = 0;


						//动画属性
						$scope.$watch('layer.animate', function (newVal, oldVal) {
							if (playAnimateCount === 0) {
								playAnimate();
								playAnimateCount++;
								return;
							}
							if (!playAnimateLastTime) {
								playAnimateLastTime = new Date()
									.getTime();
							}
							if (playAnimateLastTime - new Date()
								.getTime() < playAnimateInterval && playAnimateTimer) {
								clearTimeout(playAnimateTimer);
							}
							playAnimateLastTime = new Date()
								.getTime();

							playAnimateTimer = setTimeout(function () {
								playAnimate();
							}, playAnimateInterval);
						}, true);

					};

					//右键菜单
					var initMenu = function () {
						//(编辑链接) 动态产生
						// 右键菜单 https://github.com/Templarian/ui.bootstrap.contextMenu
						// 图片和文本的右击公共菜单
						var menuOptions = [
							['移到最前面', function ($itemScope) {
								$rootScope.$broadcast(events.layerClick, {
									action: 'bringLayerTop',
									layer: $itemScope.layer
								});
							}],
							['移到最后面', function ($itemScope) {
								$rootScope.$broadcast(events.layerClick, {
									action: 'bringLayerBottom',
									layer: $itemScope.layer
								});
							}],
							null, ['剪切<span class="mod">+X</span>', function ($itemScope) {
								$layerClipboard.cut($itemScope.layer);
							}],
							['拷贝<span>Shift+Alt+C</span>', function ($itemScope) {
								$layerClipboard.clone($itemScope.layer);
							}],
							['复制<span class="mod">+C</span>', function ($itemScope) {
								$layerClipboard.copy($itemScope.layer);
							}],
							['粘贴<span class="mod">+V</span>', function ($itemScope, $event) {
								var dropDivPageOffset = $('.drop-div>.page-base')
									.offset();
								$layerClipboard.paste({
									x: $event.pageX - dropDivPageOffset.left,
									y: $event.pageY - dropDivPageOffset.top
								});
							}],
							null, ['删除<span class="delete"></span>', function ($itemScope) {
								$rootScope.$broadcast(events.layerClick, {
									action: 'removeLayer',
									layer: $itemScope.layer
								});
							}]
						];
						$scope.menu = angular.copy(menuOptions);
						if ($scope.isText($scope.layer)) {
							// 文本附加菜单
							$scope.menu.splice(3, 0, ['编辑', function ($itemScope) {
								$scope.toEditLayerText($itemScope.layer);
							}]);
						} else if ($scope.isImage($scope.layer)) {
							// 图片附加菜单
							$scope.menu.splice(3, 0, ['替换', function ($itemScope) {
								$scope.toEditLayerImage($itemScope.layer);
							}]);
						}
					};

					var pgThumbClick = $scope.$on(events.pgThumbClick, function (e, data) {
						if (data.action === 'edit' && !inPgVessl) {
							if (data.page.id === $scope.layer.pageid) {
								initDataWatch();
							}
						}
					});
					if (idSelectdPage) {
						var pgVesselClickOff = $scope.$on(events.pgVesselClick, function (e, data) {
							if (data && data.action === 'preview' && inPgVessl) {
								if ($scope.layer.pageid && $scope.layer.pageid === data.page.id) {
									initAnimate();
								}
							}
						});
						//被选中的页面
						initDataWatch();
						if (inPgVessl) {
							cssElementAllStyle();
							initAnimate();
							$scope.$on('$destroy', function () {
								pgBgClickOff();
								layerClickOff();
								fiEditAreaOff();
								layerQuickClickOff();
								layerStyleWatchOff();
								layerStyleHeightWatchOff();
								layerContentStyleWatchOff();
								layerContentEditorStyleWatchOff();
								if (pgThumbClick) {
									pgThumbClick();
								}
								if (pgVesselClickOff) {
									pgVesselClickOff();
								}
							});
						} else {

						}
					}
					$scope.init = function () {

						//判断是否为文本层
						if ($scope.isText($scope.layer)) {
							var textContent = $scope.layer.content.text;
							//文本初始化
							$element.find('.text .content')
								.html(textContent);

						}

						//初始化消息监听
						initMsgMonitor();
						if (idSelectdPage) {
							//被选中的页面
							if (!inPgVessl) {
								cssElementAllStyle();
							}
						} else {
							cssElementAllStyle();
							return;
						}

						Base.init($scope.layer, $element);
						Base.setDirtyCheck(function (fn) {
							$scope.$apply(function () {
								fn();
							});
						});
						//初始化拖拽事件
						initDragEvent();
						//初始化拉伸事件
						initScaleEvent();
						//初始化旋转事件
						initRotateEvent();
						//初始化菜单
						initMenu();

						$scope.cancelTextEdit($scope.layer);
						//刚刚创建的图层
						if ($scope.layer._new) {
							$scope.layer._new = null;
							$scope._selectLayer($scope.layer, {
								init: true
							});
						} else {
							$layerManage.unSelect($scope.layer);
						}
					};

				}
			};
	}]);
});
