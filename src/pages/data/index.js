define([
	'app',
	'pages/data/side-bar/index',
	'pages/data/main-area/index',
], function(app) {
	app.controller('DataController', ['$scope', '$rootScope', 'flyer', function($scope, $rootScope, flyer) {
		$scope.flyer = flyer;
	}]);
});