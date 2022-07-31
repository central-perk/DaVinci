define(['app'], function (app) {
	app.factory('FansService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('fans');
			return {
				list: function (query) {
					return baseTpl.customGET('', query);
				},
				remove: function (fanID) {
					return baseTpl.one(fanID).customDELETE();
				}
			};
	}]);
});