define(['app'
], function (app) {
	app.factory('ReplyService', ['Restangular', '$timeout', 'config',
		function (Restangular, $timeout, config) {
			var baseRoute = Restangular.all('replys');
			return {
				list: function (query) {
					return baseRoute.customGET('', query);
				},
				remove: function (tplReplyID) {
					return baseRoute.one(tplReplyID)
						.remove();
				},
				create: function (tplReply) {
					return baseRoute.post(tplReply);
				}
			};
		}
	]);

});