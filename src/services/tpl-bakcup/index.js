define(['app'
], function (app) {
	app.factory('TplBackupService', ['Restangular', '$timeout', 'config',
		function (Restangular, $timeout, config) {
			var baseTpl = Restangular.all('templateBackups');
			return {
				updateStar: function (tplBackupID, tpl) {
					return baseTpl.one(tplBackupID)
						.customPUT(tpl, 'star');
				},
				updateTags: function (tplBackupID, tpl) {
					return baseTpl.one(tplBackupID)
						.customPUT(tpl, 'tags');
				},
				get: function (tplBackupID, query) {
					return baseTpl.one(tplBackupID).customGET('', query);
				}
			};
		}
	]);

});