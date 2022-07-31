define(['app'], function (app) {
	app.factory('VoteService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('votes');
			return {
				get: function (query) {
					return baseTpl.customGET('', query);
				},
				remove: function (collectID) {
					return baseTpl.one(collectID).customDELETE();
				},
				create: function (collect) {
					return baseTpl.post(collect);
				}
			};
		}
	]);
});