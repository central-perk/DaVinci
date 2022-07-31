define(['app'], function (app) {
	app.factory('FollowService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('follows');
			return {
				list: function (query) {
					return baseTpl.customGET('', query);
				},
				create: function (follow) {
					return baseTpl.post(follow);
				},
				remove: function (followID) {
					return baseTpl.one(followID).customDELETE();
				}
			};
	}]);

});