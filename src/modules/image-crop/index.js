define(['app'], function (app) {
	//交互作品图片上传
	app.directive('imageCrop', ['config', '$timeout', '$rootScope', '$alert',
        function factory(config, $timeout, $rootScope, $alert) {
			var events = config.EVENTS;
			var directive = {
				restrict: 'E',
				templateUrl: '/modules/image-crop/index.html',
				replace: true,
				scope: {
					compressWidth: "@compressWidth",
					boxHeight: "@boxHeight",
					boxWidth: "@boxWidth",
					cropSize: '=cropSize'
				},
				link: function ($scope, $element, $attrs) {
					var __initFlag = false,
						__init = false,
						numDigts = 4,
						cropBoxId = $attrs.cropBoxId || 'crop-box',
						compressSuffix,
						boxHeight = $scope.boxHeight,
						boxWidth = $scope.boxWidth,
						minSize = {
							width: 100,
							height: 100
						},
						maxSize = {};
					$scope.cropBoxId = cropBoxId;
					if ($scope.compressWidth) {
						compressSuffix = '?imageView2/3/w/' + $scope.compressWidth + '/q/100';
					}
					if ($scope.cropSize) {
						$scope.cropSize = $scope.cropSize.split(',');
						minSize.width = parseInt($scope.cropSize[0]);
						minSize.height = parseInt($scope.cropSize[1]);
						maxSize.width = parseInt($scope.cropSize[2]);
						maxSize.height = parseInt($scope.cropSize[3]);
					}

					//实时裁剪参数结果
					function updatePreview(c) {
						if (!$scope.image || !cropBox) return;
						// if (!__init) {
						//     __init = true;
						//     return;
						// };
						$scope.image.crop = $scope.image.crop || {};
						$scope.image.crop.x = c.x.toFixed(numDigts);
						$scope.image.crop.y = c.y.toFixed(numDigts);
						$scope.image.crop.x2 = c.x2.toFixed(numDigts);
						$scope.image.crop.y2 = c.y2.toFixed(numDigts);
						$scope.image.crop.w = c.w;
						$scope.image.crop.h = c.h;
						$scope.image.crop.bX = cropBox.getBounds()[0];
						$scope.image.crop.bY = cropBox.getBounds()[1];
						$scope.image.crop.ratio = $scope.image.ratio;
						var crop = $scope.image.crop;
						if (parseInt(crop.w)) {
							$scope.$emit(events.imageCropClick, {
								action: 'select',
								url: $scope.image.url,
								id: $scope.image.id,
								crop: $scope.image.crop
							});
						}
					}

					var cropBox,
						defOptions = {
							bgFade: true,
							allowSelect: false,
							boxHeight: boxHeight,
							boxWidth: boxWidth,
							bgOpacity: 0.8,
							setSelect: [0, 0, 200, 200],
							minSize: [minSize.width, minSize.height],
							onDblClick: function () {
								$scope.$emit(events.imageCropClick, {
									action: 'selectBoxDbClick'
								});
							}
						};
					$element.find('#' + cropBoxId).Jcrop(defOptions, function () {
						cropBox = this;
					});
					$scope.cropInit = function (_options) {
						if (!cropBox) return;
						var options = _options || {},
							crop = $scope.image.crop,
							change = options.change,
							url = $scope.image.url,
							ratio = $scope.image.ratio;
						//这段逻辑很重要，很影响裁剪框，切勿随便修改
						if (crop && crop.x && typeof parseInt(crop.x) === 'number') {
							//还原已裁减
							defOptions.setSelect = [
                                parseInt(crop.x),
                                parseInt(crop.y),
                                parseInt(crop.x2),
                                parseInt(crop.y2)
                            ];
						}
						if (ratio !== -1) {
							defOptions.aspectRatio = ratio;
						}
						//链接改变，重置链接
						if (change) {
							defOptions.setSelect = [0, 0, 200, 200]
						}
						if (url) {
							var image = new Image;
							image.src = url;
							image.onload = function () {
								if (image.height < minSize.height || image.width < minSize.width) {
									defOptions.minSize[0] = (image.height > image.width ? image.width : image.height) * defOptions.aspectRatio;
									defOptions.minSize[1] = defOptions.minSize.width;
								} else if (minSize.height && minSize.width) {
									defOptions.minSize = [minSize.width, minSize.height];
								}
								if (maxSize.height && maxSize.width) {
									defOptions.maxSize = [maxSize.width, maxSize.height];
								}
								defOptions.onSelect = updatePreview;
								$timeout(function () {
									cropBox.setImage(url);
									$timeout(function () {
										cropBox.setOptions(defOptions);
									});
								});
							}
						} else {
							cropBox.setOptions(defOptions);
						}
					};

					var imageManageClickOff = $rootScope.$on(events.imageManageClick, function (event, data) {
						$scope.image = $scope.image || {};
						if (data.action === 'choose' && data.url) {
							var url = data.url + compressSuffix;
							var msg = {
								action: 'preview',
								id: data.id || $scope.image.id,
								url: url
							};
							//原图片发生变化，缩略图也变化
							msg.crpoUrl = url;
							$scope.image.url = url;
							$scope.$emit(events.imageCropClick, msg);
							$timeout(function () {
								$scope.cropInit({
									change: true
								});
							});
						}
					});
					//图片被点击
					var pgImageClickOff = $rootScope.$on(events.pgImageClick, function (event, data) {
						$scope.image = $scope.image || {};
						//增加提示信息
						if (data.tip) {
							$scope.tip = data.tip;
						} else {
							$scope.tip = null;
						}
						if ((data.action === 'edit' || data.action === 'editPgImage') && data.image) {
							$scope.image.id = data.image.id;
							$scope.image.type = data.image.type;
							$scope.image.ratio = data.image.ratio;
							$scope.image.crop = data.image.crop || {};
							if (data.image.url !== '' && data.image.url) {
								//图片存在
								$scope.image.url = data.image.url.split('?')[0] + compressSuffix;
								$scope.image.size = data.image.size;
								$scope.cropInit();
							}
						}
					});

					$scope.$emit(events.imageCropClick, {
						action: 'init'
					});

					$scope.$on('$destroy', function () {
						imageManageClickOff();
						pgImageClickOff();
					});
				}
			}
			return directive;
        }
    ]);
});