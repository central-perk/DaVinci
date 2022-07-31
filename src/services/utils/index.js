define(['app'], function (app) {
	app.service('$utils', ['config', '$rootScope', '$alert', 'CollectService', function (config, $rootScope, $alert, CollectService) {
		this.isAuthor = function(user) {
			return $rootScope.user._id === user._id;
		};


		//创建id
		this.createToken = function (_length) {
			var length = _length || 6;
			var chars = '0123456789abcdefghiklmnopqrstuvwxyz'.split('');
			str = '';
			for (var i = 0; i < length; i++) {
				str += chars[Math.floor(Math.random() * chars.length)];
			}
			return str;
		};

		//对象转换为键值对
		this.makeQuery = function (data) {
			var query = [];
			for (var i in data) {
				if (data[i] || data[i] === 0) {
					query.push(i + '=' + data[i]);
				}
			}
			return query.join('&');
		};

		this.rmHtmlTag = function (str) {
			return str.replace(/<.*?>/g, '');
		};
		//退回
		this.back = function () {
			return window.history.go(-1);
		};

		this.url = {
			join: function () {
				var tmp = [];
				for (var key in arguments) {
					if (arguments[key]) {
						tmp.push(arguments[key].replace(/(^\/*)|(\/*$)/g, ''));
					}
				}
				return tmp.join('/');
			}
		};

		//判断对象是否完全相同
		this.objEqual = function (newVal, oldVal, ingnoreKeys) {
			var newValClone = {},
				oldValClone = {};
			for (var key in newVal) {
				if (_.indexOf(ingnoreKeys, key) < 0) {
					if (newVal[key]) {
						newValClone[key] = newVal[key];
					}
				}
			}
			for (var okey in oldVal) {
				if (_.indexOf(ingnoreKeys, okey) < 0) {
					if (oldVal[okey]) {
						oldValClone[okey] = oldVal[okey];
					}

				}
			}
			return _.isEqual(newValClone, oldValClone);
		};


		/**
		 * @method 抛出错误
		 * @param  error  错误信息
		 */
		this.debugger = function (error) {
			if (!error) return;

			var stackLabel = '错误信息:',
				stackMsg = stackLabel,
				DVC = window.DVC || {};

			if (typeof error === 'object') {
				//获取对象类型错误
				for (var key in error) {
					stackMsg += error[key] + ';';
				}
			} else if (typeof error === 'string' || typeof error === 'number') {
				//获取数组或字符串类型错误
				stackMsg = error;
			}

			//抛出错误
			if (DVC && DVC.env === 'pro') {
				console.log(stackMsg);
			} else {
				alert(stackMsg);
			}
		};


		//TODO 单独写一个service服务于highcharts数据组装 for chart
		this.setLineChart = function ($scope, type, seriesData, categories) {
			$scope[type + 'ChartConfig'] = {
				options: {
					chart: {
						type: 'line',
						zoomType: 'x'
					},
					credits: {
						enabled: false
					},
					exporting: {
						enabled: false
					}
				},
				title: {
					text: ''
				},
				loading: false,
				series: seriesData,
				xAxis: {
					title: {
						text: ''
					},
					categories: categories,
					labels: {
						step: Math.round(categories.length / 15) || 1,
						staggerLines: 1,
					}
				},
				yAxis: {
					title: {
						text: ''
					},
					min: 0
				},
				useHighStocks: false,
				size: {
					height: 300
				},
				func: function (chart) {
					$scope[type + 'ChartExport'] = function () {
						chart.exportChart();
					};
				}
			};
		};

		this.setPieChart = function ($scope, type, seriesData) {
			$scope[type + 'ChartConfig'] = {
				options: {
					chart: {
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false
					},
					plotOptions: {
						pie: {
							allowPointSelect: true,
							cursor: 'pointer',
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								format: '<b>{point.name}</b>: {point.y:.1f} %'
							}
						}
					},
					tooltip: {
						pointFormat: '浏览量: <b>{point.y:.1f}%</b>'
					},
					credits: {
						enabled: false
					},
					exporting: {
						enabled: false
					}
				},
				title: {
					text: ''
				},
				series: [{
					type: 'pie',
					data: seriesData
				}],
				loading: false,
				size: {
					height: 300
				},
				func: function (chart) {
					$scope[type + 'ChartExport'] = function () {
						chart.exportChart();
					};
				}
			};
		};
		this.setBarChart = function ($scope, type, chartType, seriesData, categories) {
			$scope[type + 'ChartConfig'] = {
				options: {
					chart: {
						type: chartType
					},
					tooltip: {
						pointFormat: '浏览量: <b>{point.y}</b>'
					},
					legend: {
						enabled: false
					},
					credits: {
						enabled: false
					},
					exporting: {
						enabled: false
					}
				},
				title: {
					text: ''
				},
				series: [{
					data: seriesData
				}],
				xAxis: {
					categories: categories
				},
				yAxis: {
					title: {
						text: ''
					}
				},
				loading: false,
				size: {
					height: 300
				},
				func: function (chart) {
					$scope[type + 'ChartExport'] = function () {
						chart.exportChart();
					};
				}
			};
		};


		//验证文件类型
		this.validateFileType = function (allowTypes, type) {
			if (allowTypes.indexOf(type) > -1) {
				return true;
			} else {
				return false;
			}
		};

		this.validateFileExt = function (allowTypes, name) {
			for (var i = allowTypes.length - 1; i >= 0; i--) {
				// console.log(name);
				// console.log(allowTypes[i].replace('image/', ''));
				// console.log(name.indexOf(allowTypes[i].replace('image/', '')) > 0);
				if (name.indexOf(allowTypes[i].replace('image/', '')) > 0) {
					return true;
				}
				if (i === 0) {
					return false;
				}
			}
		};

		this.isDraft = function (flyerStatus) {
			return flyerStatus === config.FLYERS.status.draft;
		};

		this.imageView2 = function (options) {
			var _width = options.width,
				_height = options.height,
				_uri = options.uri,
				_model = options.model || '0',
				_sizeFop = '';
			if (!_uri || _uri === '') {
				return null;
			}
			if (!_width && !_height) {
				return _uri;
			}
			_sizeFop += 'imageView2/' + _model;
			if (_width) {
				_sizeFop += '/w/' + _width;
			}
			if (_height) {
				_sizeFop += '/h/' + _height;
			}
			_sizeFop += '/q/100';
			//+ '/h/' + _height;

			if (_uri && _uri.indexOf('watermark') > -1) {
				_uri = _uri + '|';
			} else {
				_uri = _uri + '?';
			}
			_uri += _sizeFop;
			return _uri;
		};
		this.getTransform = function (options) {
			var transformStyle = '';
			transformStyle += 'translateX(' + options.x + 'px) ';
			transformStyle += 'translateY(' + options.y + 'px) ';
			transformStyle += 'translateZ(0px) ';
			transformStyle += 'rotateX(0deg) ';
			transformStyle += 'rotateY(0deg) ';
			transformStyle += 'rotateZ(' + options.rotateZ + 'deg) ';
			transformStyle += 'scaleX(1) ';
			transformStyle += 'scaleY(1) ';
			transformStyle += 'scaleZ(1) ';
			transformStyle += 'skewX(0deg) ';
			transformStyle += 'skewY(0deg);';
			return transformStyle;
		};
		this.getStyleStr = function (_style, options) {
			var style = this.getStyle(_style, options);
			var str = '';
			for (var key in style) {
				if (key === 'transform') {
					if (options && options.rmTransform) {
						continue;
					}
					str += '-webkit-transform:' + style[key] + ';transform:' + style[key] + ';';
				} else if (key === 'border-radius') {
					str += '-webkit-border-radius:' + style[key] + ';border-radius:' + style[key] + ';';
				} else {
					str += key + ':' + style[key] + ';';
				}
			}
			return str;
		};
		this.getStyle = function (style, options) {
			var layerOunterStyle = {};

			if (style.width) {
				layerOunterStyle.width = style.width + 'px';
			}
			if (style.height) {
				layerOunterStyle.height = style.height + 'px';
			}
			if (style.opacity || style.opacity === 0) {
				layerOunterStyle.opacity = style.opacity / 100;
			}
			if (style.zIndex) {
				layerOunterStyle['z-index'] = style.zIndex;
			}
			if (style.backgroundColor) {
				layerOunterStyle['background-color'] = style.backgroundColor;
			}
			if (style.borderColor) {
				layerOunterStyle['border-color'] = style.borderColor;
			}
			if (style.borderRadius) {
				if (options && options.width && options.height) {
					var min = options.width < options.height ? options.width : options.height;
					layerOunterStyle['border-radius'] = parseInt((min * style.borderRadius / 200)) + 'px';
				} else {
					layerOunterStyle['border-radius'] = style.borderRadius + '%';
				}
			}
			if (style.borderWidth) {
				layerOunterStyle['border-width'] = style.borderWidth + 'px';
			}
			if (style.boxShadow) {
				layerOunterStyle['box-shadow'] = 'rgb(40,40,40) 0px 0px ' + style.boxShadow + 'px ' + style.boxShadow / 5 + 'px';
			}
			if (style.borderStyle) {
				layerOunterStyle['border-style'] = style.borderStyle;
			}
			if (style.blur) {
				layerOunterStyle['-webkit-filter'] = 'blur(' + style.blur * 5 / 100 + 'px);';
			}
			if (style.textAlign) {
				layerOunterStyle['text-align'] = style.textAlign;
			}
			if (style.lineHeight) {
				layerOunterStyle['line-height'] = style.lineHeight;
			}
			if (style.paddingLeft) {
				layerOunterStyle['padding-left'] = style.paddingLeft + 'px';
			}
			if (style.paddingTop) {
				layerOunterStyle['padding-top'] = style.paddingTop + 'px';
			}
			if (style.paddingRight) {
				layerOunterStyle['padding-right'] = style.paddingRight + 'px';
			}

			if (style.fontSize) {
				layerOunterStyle['font-size'] = style.fontSize + 'px';
			}

			if (style.textDecoration) {
				layerOunterStyle['text-decoration'] = style.textDecoration;
			}
			if (style.fontWeight) {
				layerOunterStyle['font-weight'] = style.fontWeight;
			}

			if (style.fontStyle) {
				layerOunterStyle['font-style'] = style.fontStyle;
			}

			if (style.fontFamily) {
				layerOunterStyle['font-family'] = style.fontFamily;
			}
			if (style.color) {
				layerOunterStyle.color = style.color;
			}

			if (style.verticalAlign) {
				layerOunterStyle['vertical-align'] = style.verticalAlign;
			}

			if (style.marginTop) {
				layerOunterStyle['margin-top'] = style.marginTop + 'px';
			}

			if (style.letterSpacing) {
				layerOunterStyle['letter-spacing'] = style.letterSpacing + 'px';
			}

			if (style.svg) {
				layerOunterStyle['-webkit-mask-image'] = 'url(' + style.svg + ')';
			}



			layerOunterStyle.transform = this.getTransform({
				x: style.x || 0,
				y: style.y || 0,
				rotateZ: style.rotateZ || 0
			});
			return layerOunterStyle;
		};
		this.rgb2hex = function (rgb) {
			if (rgb.charAt(0) == '#')
				return rgb;
			var n = Number(rgb);
			var ds = rgb.split(/\D+/);
			var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
			return "#" + zero_fill_hex(decimal, 6);
		};

		function zero_fill_hex(num, digits) {
			var s = num.toString(16);
			while (s.length < digits)
				s = "0" + s;
			return s;
		}



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


	}]);
});