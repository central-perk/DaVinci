define(['app'], function(app) {
	app.directive('editable', function() {
		return  {
			restrict: 'EA',
			scope: {
				ngModel: '=',
				minlength: '@',
				onSave: '&',
				onDel: '&'
			},
			link: function($scope, $ele, $attrs) {
				$scope.len = {};
				$scope.temp = {
					val: ''
				};

				$scope.test = 123;
				if ($attrs.minlength !== undefined) {
					$scope.len.min = Number($attrs.minlength)
				}
				


				$scope.edit = function() {
					$scope.temp.val = $scope.ngModel;
					// $scope.temp.val = _.cloneDeep($scope.ngModel);
					$scope.editing = true;
				}
				$scope.cancel = function() {
					$scope.editing = false;
				}
				$scope.save = function() {
					$scope.ngModel = _.cloneDeep($scope.temp);
					$scope.editing = false;
					$scope.onSave({data: $scope.ngModel});
				}
				$scope.del = function() {
					$scope.onDel({data: $scope.ngModel});
				}
			},
			templateUrl: '/modules/editable/index.html'
		}
	});
});