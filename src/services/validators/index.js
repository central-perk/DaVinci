define(['app'], function(app) {
	//modalService to show modal
	app.service('$validator', ['config',

		function(config) {
			this.validateVideoUrl = function(value) {
				if (value) {
					return /(https?|ftp|mms):\/\/([A-z0-9]+[_\-]?[A-z0-9]+\.)*(.swf|.mp4)$/.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};
			this.validateEmail = function(value, canNull) {
				if (value) {
					var len = value.length <= 30;
					return len && /^([a-zA-Z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};
			this.validateLink = function(value, canNull) {
				if (value) {
					var regexp = new RegExp('[\/\.]+', 'gi');
					// var regexp = new RegExp('[a-zA-Z0-9\\.\\-]+([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?', 'gi');
					return regexp.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};
			this.validateAudio = function(value, canNull) {
				if (value) {
					var regexp = new RegExp('\.mp3$', 'gi');
					return this.validateLink(value, canNull) && regexp.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};
			this.validateNumber = function(value, canNull) {
				if (value) {
					return /^[0-9]+$/.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};

			this.validateTel = function(value, canNull) {
				if (value) {
					return /1[3458]\d{9}(?=,|$)/g.test(value);
				} else if (canNull && (value === '' || value === undefined)) {
					return true;
				} else {
					return false;
				}
			};
			// 剩余可输入字数
			this.getLeftLen = function(value, total) {
				return total - value.length;
			};

			function removeHtmlTag(str) {
				return str.replace(/<.*?>/g, '');
			}

			function lenCurry(limitLen, options) {
				return function(str) {
					if (options && options.removeHtml && str) {
						str = removeHtmlTag(str);
					}
					if (str) {
						return limitLen - str.length;
					} else {
						return limitLen;
					}
				};
			}
			this.lenCurry = function(limitLen) {
				return lenCurry(limitLen);
			};
			var limit = config.CPTS[config.FLYERS.categorys.static].limit;
			this.smTitleLeft = lenCurry(limit.smTitle);
			this.titleLeft = lenCurry(limit.title);
			this.subTitleLeft = lenCurry(limit.subTitle);

			//简介去除html tag
			this.descLeft = lenCurry(limit.desc, {
				removeHtml: true
			});
			this.smDescLeft = function(options) {
				if (options) {
					return lenCurry(limit.smDesc, options);
				} else {
					return lenCurry(limit.smDesc);
				}
			};

			this.eventNameLeft = lenCurry(limit.eventName);
			this.addrLeft = lenCurry(limit.addr);

			//图文内容去除html tag
			this.textLeft = lenCurry(limit.text, {
				removeHtml: true
			});

			this.flyerTitleLeft = lenCurry(config.FLYERS.setting.limit.flyerTitle);
			this.flyerDescLeft = lenCurry(config.FLYERS.setting.limit.flyerDesc);
			this.btnLeft = lenCurry(config.FLYERS.setting.limit.btn);
			this.pwLeft = lenCurry(config.FLYERS.setting.limit.pw);

		}
	]);
});
