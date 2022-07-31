define([
	'app'
], function(app) {
	app.directive('fiEditArrange', ['config', '$rootScope', '$layerManage', '$timeout', function(config, $rootScope, $layerManage, $timeout) {
		return {
			restrict: 'E',
			templateUrl: '/modules/flyer-interact-editor/edit-area/arrange/index.html',
			scope: {
				layer: "=ngModel"
			},
			link: function($scope, $element, $attrs) {
				$scope.bringLayerTop = function() {
					$layerManage.bringLayerTop($scope.layer);
				};

				$scope.bringLayerBottom = function() {
					$layerManage.bringLayerBottom($scope.layer);
				};

				$scope.bringLayerUp = function() {
					$layerManage.bringLayerUp($scope.layer);
				};

				$scope.bringLayerDown = function() {
					$layerManage.bringLayerDown($scope.layer);
				};


				$scope.mvLeft = function() {
					$scope.layer.style.x = 0;
				};

				$scope.mvCenter = function() {
					$scope.layer.style.x = Math.round((320 - $scope.layer.style.width) / 2);
				};

				$scope.mvRight = function() {
					$scope.layer.style.x = 320 - $scope.layer.style.width;
				};

				$scope.mvTop = function() {
					$scope.layer.style.y = 0;
				};

				$scope.mvMiddle = function() {
					$scope.layer.style.y = Math.round((506 - $scope.layer.style.height) / 2);
				};

				$scope.mvBottom = function() {
					$scope.layer.style.y = 506 - $scope.layer.style.height;
				};


				$scope.widthChange = function(data) {
					if ($scope.layer.force){
						$scope.layer.style.height = Math.round(data.newVal * $scope.layer.style.height / data.oldVal);
					}
				};

				$scope.heightChange = function(data) {
					if ($scope.layer.force){
						$scope.layer.style.width = Math.round(data.newVal * $scope.layer.style.width / data.oldVal);
					}
				};



			}
		};
	}]);
});
