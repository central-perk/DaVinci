// 颜色输入框
define(['app'], function (app) {
	app.directive('inputColor', ['$timeout', 'config', function ($timeout, config) {
		var events = config.EVENTS;
		return {
			restrict: 'AE',
			templateUrl: '/modules/input-color/index.html',
			// require: 'ngModel',
			replace: true,
			scope: {
				color: '=ngModel',
				viewColor: '=viewColor',
				onChange: '&onChange',
				allowEmpty: '@',
				trigger: '@'
			},
			link: function ($scope, $element, $attrs, ngModelCtrl) {
				var tmpChange = false;
				var inputColorID = $scope.$id;
				var iframeWindow;
				$scope.inputClass = $attrs.inputClass;
				var $input = $element.find('.color-input');

				// ngModel -> input
				$scope.$watch('color', function (value) {
					if ($scope.allowEmpty) {

					} else if (value && isHex(value)) {

					} else {
						// value = '';
					}
					// $input.val(value);
					if (value !== 'undefined' && !tmpChange) {
						$scope.onChange({
							data: value
						});
						if (iframeWindow && value !== 'undefined') {
							iframeWindow.setInputColor(value);
						}
					} else {
						if (iframeWindow) {
							if ($scope.color && $scope.color !== 'undefined' && $scope.color !== '') {
								iframeWindow.setInputColor($scope.color);
							} else {
								iframeWindow.setInputColor('none');
							}
						}
						tmpChange = false;
					}
				});

				$scope.$watch('viewColor', function (value) {
					if (iframeWindow) {
						if (value && value !== 'undefined') {
							iframeWindow.setInputColor(value);
							$scope.color = value;
							tmpChange = true;
						} else {
							$scope.color = '';
							tmpChange = true;
							iframeWindow.setInputColor('none');
						}
					}
				});

				// value -> ngModel & input
				$scope.updateValue = function (value) {
					$input.val(value);
					ngModelCtrl.$setViewValue(value);
					$timeout(function () {
						$scope.$apply();
					});
				};

				// 判断色值是否是hex格式
				function isHex(value) {
					return true;
				}

				$input.on('blur', function () {
					var value = $input.val();
					if (isHex(value)) {
						$scope.updateValue(value);
					} else {
						value = ngModelCtrl.$viewValue;
						$scope.updateValue(value);
					}
				});



				$scope.colorAreaStyle = function () {
					if ($scope.color) {
						return {
							background: $scope.color
						};
					} else {
						return {
							border: 'none'
						};
					}
				};
				$scope.initIframe = function () {
					var iframe = $element.find('iframe')[0];
					iframe.onload = function () {
						iframeWindow = iframe.contentWindow;
						iframeWindow.inputColorID = inputColorID;
						if (iframeWindow) {
							iframeWindow.setInputColor($scope.color || '');
						}
					};
				};
				window.INPUT_COLOR = window.INPUT_COLOR || {};
				window.INPUT_COLOR[inputColorID] = {
					setColor: function (val) {
						$scope.color = val;
						$scope.$apply();
					}
				};
				$scope.initIframe();
			}
		};
	}]);
});