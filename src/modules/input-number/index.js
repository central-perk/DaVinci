// 数字输入框
define(['app'], function(app) {
	app.directive('inputNumber', ['$timeout', function($timeout) {
		var log10 = function(val) {
 			return Math.log(val) / Math.LN10;
		};

		return {
			restrict: 'EA',
			templateUrl: '/modules/input-number/index.html',
			require: 'ngModel',
			transclude: true,
			replace: true,
			scope: {
				ngModel: '=',
				state: '=state',
				onChange: '&'
			},
			link: function($scope, $element, $attrs, ngModelCtrl) {
				$scope.inputClass = $attrs.inputClass;

				var unit = $attrs.unit,
					unitLen = unit.length;

				$scope.unit = $attrs.unit;

				var $input = $element.find('input'),
					options = {};

				options.min = $attrs.min ? parseFloat($attrs.min) : 0;
				options.max = $attrs.max ? parseFloat($attrs.max) : 100;
				options.step = $attrs.step ? parseFloat($attrs.step) : 1;
				options.precision = $attrs.precision ? parseFloat($attrs.precision) : Math.ceil(log10(10/options.step)) - 1;

				$input.on('keyup', function() {
					var value = $input.val(),
						newValue = value.replace(/[^(0-9|\-).+]/g, '');
					if (value !== newValue) {
						$input.val(newValue);
					}
				});

				// 从input获得要更新到模型的值
				function getValue() {
					var value = $input.val();

					if (check(value)) {
						return fixNumber(value);
					} else {
						return $scope.ngModel;
					}
				}

				/**
				 * 设置数值的精确度
				 * @param  {String, Number} value
				 * @return {Number}
				 */
				function fixNumber(value) {
					value = Number(value).toFixed(options.precision);
					return Number(value);
				}

				/**
				 * 检查input中数值是否符合要求（大小，正则）
				 * @param  {String} value
				 * @return {Boolean}
				 */
				function check(value) {
					if (value === '' || value === undefined) return false;
					value = Number(value);
					var max = options.max,
						min = options.min;
					if (_.isNaN(value)) return false;
					if (_.isNumber(value)) {
						if (value > max || value < min) {
							return false;
						}
					}
					return true;
				}


				// model -> input
				// input ==> 123px
				// model ==> 123
				$input.on('focus', function() {
					$input.val($scope.ngModel);
				});

				// input -> model
				// input ==> 123px
				// model ==> 123
				$input.on('blur', function() {
					var value = getValue();
					apply(value); // 必须放在这是input value 之前
					value += unit;
					$input.val(value);
				});


				$scope.$watch('ngModel', function(newVal, oldVal) {
					// newVal = newVal || 0;

					if (check(newVal)) {
						newVal = fixNumber(newVal);
						newVal += unit;
						$input.val(newVal);
					} else {
						oldVal += unit;
						$input.val(oldVal);
					}

				});


				var $operate = $element.find('.operate');

				$operate.on('click', '.plus', function() {
					var value = Number(angular.copy($scope.ngModel));
					value += options.step;
					if (value <= options.max) {
						value = fixNumber(value);
						apply(value);
					}
				});
				$operate.on('click', '.minus', function() {
					var value = Number(angular.copy($scope.ngModel));
					value -= options.step;
					if (value >= options.min) {
						value = fixNumber(value);
						apply(value);
					}
				});



				// 将值同步值模型
				function apply(value) {
					$scope.onChange({
						data: {
							newVal: value,
							oldVal: $scope.ngModel
						}
					});
					$scope.$apply(function() {
						$scope.ngModel = value;
					});
				}
			}
		};
	}]);
});