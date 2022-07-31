define(['app'], function (app) {
	app.factory('CollectService', ['Restangular', 'config',
		function (Restangular, config) {
			var baseTpl = Restangular.all('collects');
			return {
				list: function (query) {
					return baseTpl.customGET('', query);
				},
				create: function (collect) {
					return baseTpl.post(collect);
				},
				listTpl: function (query) {
					query = _.merge({category: 0}, query);
					return baseTpl.customGET('', query);
				},
				listFlyer: function (query) {
					query = _.merge({category: 1}, query);
					return baseTpl.customGET('', query);
				},
				remove: function (collectID) {
					return baseTpl.one(collectID).customDELETE();
				}
			};
		}
	]);
});