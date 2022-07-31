define(['app'
], function (app) {
	app.factory('TplService', ['Restangular', '$timeout', 'config',
		function (Restangular, $timeout, config) {
			var baseTpl = Restangular.all('templates');
			return {
				list: function (query) {
					return baseTpl.customGET('', query);
				},
				create: function (tpl) {
					return baseTpl.post(tpl);
				},
				getDetail: function (tplID, query) {
					return baseTpl.one(tplID)
						.customGET('detail', query);
				},
				getUser: function(tplID) {
					return baseTpl.one(tplID)
						.customGET('user');
				},
				getSetting: function (tplID) {
					return baseTpl.one(tplID)
						.customGET('setting');
				},
				updateSetting: function (tplID, tpl) {
					return baseTpl.one(tplID)
						.customPUT(tpl, 'setting');
				},
				updateStar: function (tplID, tpl) {
					return baseTpl.one(tplID)
						.customPUT(tpl, 'star');
				},
				updateStatus: function (tplID, tpl) {
					return baseTpl.one(tplID).one('status')
						.customPUT({
							status: tpl.status,
							content: tpl.content
						});
				},
				transformToFlyer: function (tplID, form) {
					return baseTpl.one(tplID).one('flyer')
						.customPOST(form);
				},
				remove: function (tplID) {
					return baseTpl.one(tplID)
						.remove();
				},
				exchange: function (tplID) {
					return baseTpl.one(tplID).one('exchange')
						.post();
				},
				submit: function (tplID) {
					return baseTpl.one(tplID).one('submit')
						.customPUT();
				}
			};
		}
	]);

});